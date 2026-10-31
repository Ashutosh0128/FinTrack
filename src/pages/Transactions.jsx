import { useMemo, useState } from "react";
import { Plus, Receipt } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { useFinance } from "../context/FinanceContext";
import TransactionForm from "../features/transactions/TransactionForm";
import TransactionFilters from "../features/transactions/TransactionFilters";
import TransactionList from "../features/transactions/TransactionList";

const Transactions = () => {
  const { state, dispatch } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
    sort: "newest",
    startDate: "",
    endDate: "",
  });

  const transactions = state.transactions || [];

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.search.trim()) {
      result = result.filter((transaction) =>
        transaction.title
          .toLowerCase()
          .includes(filters.search.toLowerCase().trim())
      );
    }

    if (filters.type !== "all") {
      result = result.filter(
        (transaction) => transaction.type === filters.type
      );
    }

    if (filters.category !== "all") {
      result = result.filter(
        (transaction) => transaction.category === filters.category
      );
    }

    if (filters.startDate) {
      result = result.filter(
        (transaction) => transaction.date >= filters.startDate
      );
    }

    if (filters.endDate) {
      result = result.filter(
        (transaction) => transaction.date <= filters.endDate
      );
    }

    result.sort((a, b) => {
      switch (filters.sort) {
        case "oldest":
          return a.date.localeCompare(b.date);

        case "highest":
          return Number(b.amount) - Number(a.amount);

        case "lowest":
          return Number(a.amount) - Number(b.amount);

        case "newest":
        default:
          return b.date.localeCompare(a.date);
      }
    });

    return result;
  }, [transactions, filters]);

  const handleSave = (formData) => {
    if (editingTransaction) {
      dispatch({
        type: "UPDATE_TRANSACTION",
        payload: {
          ...formData,
          id: editingTransaction.id,
        },
      });
    } else {
      dispatch({
        type: "ADD_TRANSACTION",
        payload: {
          ...formData,
          id: uuidv4(),
        },
      });
    }

    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (confirmed) {
      dispatch({
        type: "DELETE_TRANSACTION",
        payload: id,
      });
    }
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
    .reduce((total, item) => total + Number(item.amount), 0);

  const totalExpenses = filteredTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title-icon">
            <Receipt size={22} />
            <h1>Transactions</h1>
          </div>
          <p>Manage and track all your income and expenses.</p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      <div className="transaction-summary">
        <div className="transaction-summary-card">
          <span>Total Transactions</span>
          <h2>{filteredTransactions.length}</h2>
        </div>

        <div className="transaction-summary-card">
          <span>Total Income</span>
          <h2 className="income-amount">
            ₹{totalIncome.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="transaction-summary-card">
          <span>Total Expenses</span>
          <h2 className="expense-amount">
            ₹{totalExpenses.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      {showForm && (
        <TransactionForm
          onSave={handleSave}
          onClose={closeForm}
          transaction={editingTransaction}
        />
      )}

      <div className="transactions-section">
        <div className="section-heading">
          <div>
            <h2>All Transactions</h2>
            <p>View and manage your financial records.</p>
          </div>
        </div>

        <TransactionFilters
          filters={filters}
          setFilters={setFilters}
        />

        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Transactions;