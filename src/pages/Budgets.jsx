import { useEffect,useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useFinance } from "../context/FinanceContext";
import BudgetForm from "../features/budgets/BudgetForm";
import BudgetList from "../features/budgets/BudgetList";

function Budgets() {
  const { state, dispatch } = useFinance();
  const [editingBudget, setEditingBudget] = useState(null);

  const budgets = state.budgets || [];
  const transactions = state.transactions || [];

  const currentMonth = new Date().toISOString().slice(0, 7);

  const currentBudgets = useMemo(
    () => budgets.filter((budget) => budget.month === currentMonth),
    [budgets, currentMonth]
  );

  const getSpent = (budget) => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.category === budget.category &&
          transaction.date.slice(0, 7) === budget.month
      )
      .reduce((total, transaction) => total + Number(transaction.amount), 0);
  };

  useEffect(() => {
  currentBudgets.forEach((budget) => {
    const spent = getSpent(budget);
    const percentage = (spent / budget.limit) * 100;

    if (percentage >= 80) {
      const message =
        percentage >= 100
          ? `${budget.category} budget has exceeded its limit.`
          : `${budget.category} budget has reached ${percentage.toFixed(0)}% of its limit.`;

      const alreadyExists = (state.notifications || []).some(
        (notification) =>
          notification.message === message &&
          !notification.read
      );

      if (!alreadyExists) {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: uuidv4(),
            title: "Budget Alert",
            message,
            date: new Date().toISOString(),
            read: false
          }
        });
      }
    }
  });
}, [currentBudgets, transactions]);

  const handleSave = (budgetData) => {
    const duplicate = budgets.find(
      (budget) =>
        budget.category === budgetData.category &&
        budget.month === budgetData.month &&
        budget.id !== editingBudget?.id
    );

    if (duplicate) {
      alert("A budget already exists for this category and month.");
      return;
    }

    if (editingBudget) {
      dispatch({
        type: "UPDATE_BUDGET",
        payload: { ...editingBudget, ...budgetData }
      });
      setEditingBudget(null);
    } else {
      dispatch({
        type: "ADD_BUDGET",
        payload: { id: uuidv4(), ...budgetData }
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      dispatch({ type: "DELETE_BUDGET", payload: id });
    }
  };

  const totalLimit = currentBudgets.reduce(
    (sum, budget) => sum + Number(budget.limit), 0
  );

  const totalSpent = currentBudgets.reduce(
    (sum, budget) => sum + getSpent(budget), 0
  );

  return (
    <div className="module-page">
      <div className="page-header">
        <div>
          <h1>Budget Management</h1>
          <p>Set spending limits and manage your monthly expenses.</p>
        </div>
      </div>

      <div className="module-summary-grid">
        <div className="module-summary-card">
          <span>Total Budget</span>
          <h2>₹{totalLimit.toLocaleString("en-IN")}</h2>
        </div>

        <div className="module-summary-card">
          <span>Total Spent</span>
          <h2>₹{totalSpent.toLocaleString("en-IN")}</h2>
        </div>

        <div className="module-summary-card">
          <span>Remaining</span>
          <h2 className={totalLimit - totalSpent < 0 ? "negative" : ""}>
            ₹{(totalLimit - totalSpent).toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="module-summary-card">
          <span>Active Budgets</span>
          <h2>{currentBudgets.length}</h2>
        </div>
      </div>

      <BudgetForm
        onSave={handleSave}
        editingBudget={editingBudget}
        onCancel={() => setEditingBudget(null)}
      />

      <div className="module-section-heading">
        <h2>Current Month Budgets</h2>
        <span>{currentBudgets.length} budgets</span>
      </div>

      <BudgetList
        budgets={currentBudgets}
        getSpent={getSpent}
        onEdit={setEditingBudget}
        onDelete={handleDelete}
      />

      <div className="module-section-heading">
        <h2>Other Monthly Budgets</h2>
      </div>

      <BudgetList
        budgets={budgets.filter((budget) => budget.month !== currentMonth)}
        getSpent={getSpent}
        onEdit={setEditingBudget}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Budgets;