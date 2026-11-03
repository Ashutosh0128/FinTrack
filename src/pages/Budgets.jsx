import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

import { useFinance } from "../hooks/useFinance";
import { getCurrentMonthString } from "../utils/calculations";
import { formatCurrency, formatMonthYear } from "../utils/formatters";
import { CURRENCIES } from "../utils/constants";

import BudgetForm from "../features/budgets/BudgetForm";
import BudgetList from "../features/budgets/BudgetList";
import ConfirmModal from "../components/common/ConfirmModal";

function Budgets() {
  const { state, dispatch, currency } = useFinance();

  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingBudget, setDeletingBudget] = useState(null);

  const [currentMonth] = useState(() => getCurrentMonthString());
  const [selectedMonth, setSelectedMonth] = useState(() => getCurrentMonthString());

  const budgets = state?.budgets;
  const transactions = state?.transactions;
  const notifications = state?.notifications;
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.INR;

  // Calculate spent amount for a specific budget
  const getSpent = useCallback(
    (budget) => {
      if (!budget || !budget.category || !budget.month) return 0;
      const txList = transactions || [];

      return txList
        .filter(
          (t) =>
            t &&
            t.type === "expense" &&
            t.category === budget.category &&
            t.date &&
            t.date.slice(0, 7) === budget.month
        )
        .reduce((total, t) => total + (Number(t.amount) || 0), 0);
    },
    [transactions]
  );

  // Budgets filtered by selected month
  const filteredBudgets = useMemo(() => {
    const list = budgets || [];
    if (selectedMonth === "all") return list;
    return list.filter((b) => b.month === selectedMonth);
  }, [budgets, selectedMonth]);

  // Unique months present in budgets
  const availableMonths = useMemo(() => {
    const list = budgets || [];
    const set = new Set(list.map((b) => b.month).filter(Boolean));
    set.add(currentMonth);
    return Array.from(set).sort().reverse();
  }, [budgets, currentMonth]);

  // Notification generation for budget limits
  useEffect(() => {
    const budgetList = budgets || [];
    const notifList = notifications || [];

    budgetList.forEach((budget) => {
      const spent = getSpent(budget);
      const limit = Number(budget.limit) || 0;
      if (limit <= 0) return;

      const percentage = (spent / limit) * 100;

      if (percentage >= 80) {
        const isOver = percentage >= 100;
        const tier = isOver ? "100" : "80";
        const alertId = `budget_alert_${budget.id}_${budget.month}_${tier}`;

        const message = isOver
          ? `Your ${budget.category} budget for ${formatMonthYear(budget.month)} has exceeded its limit (${percentage.toFixed(0)}% used).`
          : `Your ${budget.category} budget for ${formatMonthYear(budget.month)} has reached ${percentage.toFixed(0)}% of its limit.`;

        // Check if this specific alert already exists
        const exists = notifList.some((n) => n.id === alertId);

        if (!exists) {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: alertId,
              title: isOver ? "Budget Exceeded Alert" : "Budget Limit Warning",
              message,
              date: new Date().toISOString(),
              read: false,
            },
          });
        }
      }
    });
  }, [budgets, getSpent, notifications, dispatch]);

  const handleSave = (budgetData) => {
    const list = budgets || [];
    const duplicate = list.find(
      (b) =>
        b.category === budgetData.category &&
        b.month === budgetData.month &&
        b.id !== editingBudget?.id
    );

    if (duplicate) {
      toast.error(`A budget for ${budgetData.category} in ${formatMonthYear(budgetData.month)} already exists.`);
      return;
    }

    if (editingBudget) {
      dispatch({
        type: "UPDATE_BUDGET",
        payload: { ...editingBudget, ...budgetData },
      });
      toast.success("Budget updated successfully");
      setEditingBudget(null);
    } else {
      dispatch({
        type: "ADD_BUDGET",
        payload: { id: uuidv4(), ...budgetData },
      });
      toast.success("Budget created successfully");
    }
  };

  const handleConfirmDelete = () => {
    if (deletingBudget) {
      dispatch({
        type: "DELETE_BUDGET",
        payload: deletingBudget.id,
      });
      toast.success("Budget deleted");
      setDeletingBudget(null);
      if (editingBudget?.id === deletingBudget.id) {
        setEditingBudget(null);
      }
    }
  };

  const totalLimit = filteredBudgets.reduce(
    (sum, b) => sum + (Number(b.limit) || 0),
    0
  );

  const totalSpent = filteredBudgets.reduce(
    (sum, b) => sum + getSpent(b),
    0
  );

  const remainingBudget = totalLimit - totalSpent;

  return (
    <div className="module-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Budget Management</h1>
          <p>Set spending limits and control your monthly expenses.</p>
        </div>

        <div className="header-filter-group">
          <label htmlFor="budget-month-select" className="filter-label">Month:</label>
          <select
            id="budget-month-select"
            className="period-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">All Months</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {formatMonthYear(m)} {m === currentMonth ? "(Current)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="module-summary-grid">
        <div className="module-summary-card">
          <span>Total Monthly Budget</span>
          <h2>{formatCurrency(totalLimit, currency)}</h2>
          <small className="summary-card-subtext">{filteredBudgets.length} active limits</small>
        </div>

        <div className="module-summary-card">
          <span>Total Spent</span>
          <h2>{formatCurrency(totalSpent, currency)}</h2>
          <small className="summary-card-subtext">Cumulative spending</small>
        </div>

        <div className="module-summary-card">
          <span>Remaining Balance</span>
          <h2 className={remainingBudget < 0 ? "negative" : "positive"}>
            {formatCurrency(remainingBudget, currency)}
          </h2>
          <small className="summary-card-subtext">
            {remainingBudget < 0 ? "Over budget limit" : "Available headroom"}
          </small>
        </div>

        <div className="module-summary-card">
          <span>Overall Utilization</span>
          <h2>
            {totalLimit > 0
              ? `${((totalSpent / totalLimit) * 100).toFixed(1)}%`
              : "0%"}
          </h2>
          <small className="summary-card-subtext">Spent vs Limit ratio</small>
        </div>
      </div>

      {/* Form */}
      <BudgetForm
        key={editingBudget ? editingBudget.id : "new"}
        onSave={handleSave}
        editingBudget={editingBudget}
        onCancel={() => setEditingBudget(null)}
        currencySymbol={currencyInfo.symbol}
      />

      {/* Budgets List */}
      <div className="module-section-heading">
        <h2>
          {selectedMonth === "all"
            ? "All Recorded Budgets"
            : `Budgets for ${formatMonthYear(selectedMonth)}`}
        </h2>
        <span>{filteredBudgets.length} budgets</span>
      </div>

      <BudgetList
        budgets={filteredBudgets}
        getSpent={getSpent}
        currency={currency}
        onEdit={setEditingBudget}
        onDelete={(b) => setDeletingBudget(b)}
        emptyMessage={`No budgets configured for ${
          selectedMonth === "all" ? "any month" : formatMonthYear(selectedMonth)
        }. Use the form above to add one.`}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingBudget)}
        onClose={() => setDeletingBudget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Budget"
        message={`Are you sure you want to delete the ${deletingBudget?.category} budget (${formatCurrency(deletingBudget?.limit || 0, currency)}) for ${formatMonthYear(deletingBudget?.month)}?`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}

export default Budgets;
