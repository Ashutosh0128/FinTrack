import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useFinance } from "../context/FinanceContext";

import GoalForm from "../features/goals/GoalForm";
import GoalList from "../features/goals/GoalList";

function SavingsGoals() {
  const { state, dispatch } = useFinance();

  const goals = state.goals || [];

  const [editingGoal, setEditingGoal] = useState(null);

  const handleSave = (goalData) => {
    if (editingGoal) {
      dispatch({
        type: "UPDATE_GOAL",
        payload: { ...editingGoal, ...goalData }
      });

      setEditingGoal(null);
    } else {
      dispatch({
        type: "ADD_GOAL",
        payload: {
          id: uuidv4(),
          ...goalData
        }
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this savings goal?")) {
      dispatch({
        type: "DELETE_GOAL",
        payload: id
      });
    }
  };

  const handleContribute = (goal) => {
    const amount = Number(
      window.prompt(`Enter contribution amount for ${goal.title}:`)
    );

    if (!Number.isFinite(amount) || amount <= 0) {
      return;
    }

    const newSavedAmount = goal.savedAmount + amount;

    if (newSavedAmount > goal.targetAmount) {
      alert("Contribution cannot exceed the remaining target amount.");
      return;
    }

    dispatch({
      type: "UPDATE_GOAL",
      payload: {
        ...goal,
        savedAmount: newSavedAmount
      }
    });

    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: uuidv4(),
        title: "Savings goal updated",
        message: `You added ₹${amount.toLocaleString("en-IN")} to ${goal.title}.`,
        date: new Date().toISOString(),
        read: false
      }
    });
  };

  const totalTarget = goals.reduce(
    (sum, goal) => sum + Number(goal.targetAmount), 0
  );

  const totalSaved = goals.reduce(
    (sum, goal) => sum + Number(goal.savedAmount), 0
  );

  const completedGoals = goals.filter(
    (goal) => goal.savedAmount >= goal.targetAmount
  ).length;

  return (
    <div className="module-page">
      <div className="page-header">
        <div>
          <h1>Savings Goals</h1>
          <p>Plan your savings and track your financial goals.</p>
        </div>
      </div>

      <div className="module-summary-grid">
        <div className="module-summary-card">
          <span>Total Target</span>
          <h2>₹{totalTarget.toLocaleString("en-IN")}</h2>
        </div>

        <div className="module-summary-card">
          <span>Total Saved</span>
          <h2>₹{totalSaved.toLocaleString("en-IN")}</h2>
        </div>

        <div className="module-summary-card">
          <span>Remaining</span>
          <h2>₹{Math.max(totalTarget - totalSaved, 0).toLocaleString("en-IN")}</h2>
        </div>

        <div className="module-summary-card">
          <span>Completed Goals</span>
          <h2>{completedGoals} / {goals.length}</h2>
        </div>
      </div>

      <GoalForm
        onSave={handleSave}
        editingGoal={editingGoal}
        onCancel={() => setEditingGoal(null)}
      />

      <div className="module-section-heading">
        <h2>Your Savings Goals</h2>
        <span>{goals.length} goals</span>
      </div>

      <GoalList
        goals={goals}
        onEdit={setEditingGoal}
        onDelete={handleDelete}
        onContribute={handleContribute}
      />
    </div>
  );
}

export default SavingsGoals;