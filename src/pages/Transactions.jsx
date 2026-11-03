import { useMemo, useState } from "react";
import { Plus, Receipt } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

import { useFinance } from "../hooks/useFinance";
import { formatCurrency } from "../utils/formatters";
import { CURRENCIES } from "../utils/constants";

import TransactionForm from "../features/transactions/TransactionForm";
import TransactionFilters from "../features/transactions/TransactionFilters";
import TransactionList from "../features/transactions/TransactionList";
import ConfirmModal from "../components/common/ConfirmModal";

const initialFilterState = {
  search: "",
  type: "all",
  category: "all",
  sort: "newest",
  startDate: "",
  endDate: "",
};

const Transactions = () => {
  const { state, dispatch, currency } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  const [filters, setFilters] = useState(initialFilterState);

  const transactions = state?.transactions;
  const budgets = state?.budgets;
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.INR;

  const filteredTransactions = useMemo(() => {
    let result = [...(transactions || [])];

    // Search filter
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.notes && t.notes.toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    // Type filter
    if (filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type);
    }

    // Category filter
    if (filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category);
    }

    // Date range filter
    if (filters.startDate) {
      result = result.filter((t) => t.date >= filters.startDate);
    }

    if (filters.endDate) {
      result = result.filter((t) => t.date <= filters.endDate);
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sort) {
        case "oldest":
          return (a.date || "").localeCompare(b.date || "");

        case "highest":
          return Number(b.amount || 0) - Number(a.amount || 0);

        case "lowest":
          return Number(a.amount || 0) - Number(b.amount || 0);

        case "newest":
        default:
          return (b.date || "").localeCompare(a.date || "");
      }
    });

    return result;
  }, [transactions, filters]);

  // Helper to check budget threshold and alert
  const checkBudgetThreshold = (txCategory, txDate, allTx) => {
    if (!txCategory || !txDate) return;
    const txMonth = txDate.slice(0, 7);
    const budgetList = budgets || [];

    const matchingBudget = budgetList.find(
      (b) => b.category === txCategory && b.month === txMonth
    );

    if (!matchingBudget || matchingBudget.limit <= 0) return;

    const totalSpent = allTx
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === txCategory &&
          t.date &&
          t.date.slice(0, 7) === txMonth
      )
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const percentage = (totalSpent / matchingBudget.limit) * 100;

    if (percentage >= 80) {
      const isOver = percentage >= 100;
      const message = isOver
        ? `Your ${txCategory} budget for ${txMonth} has exceeded its limit (${percentage.toFixed(0)}% used)!`
        : `Your ${txCategory} budget for ${txMonth} is nearing its limit (${percentage.toFixed(0)}% used).`;

      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: `budget_alert_${matchingBudget.id}_${isOver ? "100" : "80"}`,
          title: isOver ? "Budget Exceeded Alert" : "Budget Limit Warning",
          message,
          date: new Date().toISOString(),
          read: false,
        },
      });
    }
  };

  const handleSave = (formData) => {
    const txList = transactions || [];

    if (editingTransaction) {
      const updatedTx = {
        ...formData,
        id: editingTransaction.id,
      };

      dispatch({
        type: "UPDATE_TRANSACTION",
        payload: updatedTx,
      });

      const updatedList = txList.map((t) =>
        t.id === updatedTx.id ? updatedTx : t
      );
      if (updatedTx.type === "expense") {
        checkBudgetThreshold(updatedTx.category, updatedTx.date, updatedList);
      }

      toast.success("Transaction updated successfully");
    } else {
      const newTx = {
        ...formData,
        id: uuidv4(),
      };

      dispatch({
        type: "ADD_TRANSACTION",
        payload: newTx,
      });

      const updatedList = [newTx, ...txList];
      if (newTx.type === "expense") {
        checkBudgetThreshold(newTx.category, newTx.date, updatedList);
      }

      toast.success("Transaction added successfully");
    }

    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDeletePrompt = (transaction) => {
    setDeletingTransaction(transaction);
  };

  const handleConfirmDelete = () => {
    if (deletingTransaction) {
      dispatch({
        type: "DELETE_TRANSACTION",
        payload: deletingTransaction.id,
      });
      toast.success("Transaction deleted");
      setDeletingTransaction(null);
    }
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
  };

  const openAddForm = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const totalIncome = filteredTransactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + (Number(item.amount) || 0), 0);

  const totalExpenses = filteredTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + (Number(item.amount) || 0), 0);

  const netFiltered = totalIncome - totalExpenses;

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title-icon">
            <Receipt size={22} />
            <h1>Transactions</h1>
          </div>
          <p>Manage and track all your income and expenses.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="transaction-summary">
        <div className="transaction-summary-card">
          <span>Total Transactions</span>
          <h2>{filteredTransactions.length}</h2>
          <small className="summary-card-subtext">Showing filtered count</small>
        </div>

        <div className="transaction-summary-card">
          <span>Total Income</span>
          <h2 className="income-amount">
            {formatCurrency(totalIncome, currency)}
          </h2>
          <small className="summary-card-subtext">Filtered income</small>
        </div>

        <div className="transaction-summary-card">
          <span>Total Expenses</span>
          <h2 className="expense-amount">
            {formatCurrency(totalExpenses, currency)}
          </h2>
          <small className="summary-card-subtext">
            Net: {formatCurrency(netFiltered, currency)}
          </small>
        </div>
      </div>

      {/* Form Drawer / Card */}
      {showForm && (
        <TransactionForm
          key={editingTransaction ? editingTransaction.id : "new"}
          onSave={handleSave}
          onClose={closeForm}
          transaction={editingTransaction}
          currencySymbol={currencyInfo.symbol}
        />
      )}

      {/* Transactions Table Section */}
      <div className="transactions-section">
        <div className="section-heading">
          <div>
            <h2>Transaction Records</h2>
            <p>Filter, sort, inspect, and update transactions.</p>
          </div>
        </div>

        <TransactionFilters
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
        />

        <TransactionList
          transactions={filteredTransactions}
          currency={currency}
          onEdit={handleEdit}
          onDelete={handleDeletePrompt}
        />
      </div>

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingTransaction)}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deletingTransaction?.title}" (${formatCurrency(deletingTransaction?.amount || 0, currency)})? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default Transactions;
