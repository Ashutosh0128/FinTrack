import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

import { useFinance } from "../hooks/useFinance";
import { formatCurrency } from "../utils/formatters";
import { CURRENCIES } from "../utils/constants";

import GoalForm from "../features/goals/GoalForm";
import GoalList from "../features/goals/GoalList";
import ContributionModal from "../features/goals/ContributionModal";
import ConfirmModal from "../components/common/ConfirmModal";

function SavingsGoals() {
  const { state, dispatch, currency } = useFinance();

  const goals = state?.goals || [];
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.INR;

  const [editingGoal, setEditingGoal] = useState(null);
  const [deletingGoal, setDeletingGoal] = useState(null);
  const [contributingGoal, setContributingGoal] = useState(null);

  const handleSave = (goalData) => {
    if (editingGoal) {
      dispatch({
        type: "UPDATE_GOAL",
        payload: { ...editingGoal, ...goalData }
      });
      toast.success("Goal updated successfully");
      setEditingGoal(null);
    } else {
      dispatch({
        type: "ADD_GOAL",
        payload: {
          id: uuidv4(),
          ...goalData
        }
      });
      toast.success("Savings goal created successfully");
    }
  };

  const handleConfirmDelete = () => {
    if (deletingGoal) {
      dispatch({
        type: "DELETE_GOAL",
        payload: deletingGoal.id
      });
      toast.success("Goal deleted");
      setDeletingGoal(null);
      if (editingGoal?.id === deletingGoal.id) {
        setEditingGoal(null);
      }
    }
  };

  const handleContributeSubmit = (goal, amount) => {
    const target = Number(goal.targetAmount) || 0;
    const currentSaved = Number(goal.savedAmount) || 0;
    const newSavedAmount = currentSaved + amount;
    const isNowCompleted = newSavedAmount >= target;

    dispatch({
      type: "UPDATE_GOAL",
      payload: {
        ...goal,
        savedAmount: newSavedAmount
      }
    });

    // Add activity notification
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: uuidv4(),
        title: isNowCompleted ? "Goal Completed! 🎉" : "Savings Goal Deposit",
        message: isNowCompleted
          ? `Congratulations! You fully funded your goal: "${goal.title}" (${formatCurrency(target, currency)}).`
          : `You added ${formatCurrency(amount, currency)} to "${goal.title}".`,
        date: new Date().toISOString(),
        read: false
      }
    });

    if (isNowCompleted) {
      toast.success(`🎉 Congratulations! You completed "${goal.title}"!`);
    } else {
      toast.success(`Added ${formatCurrency(amount, currency)} to ${goal.title}`);
    }
  };

  const totalTarget = goals.reduce(
    (sum, goal) => sum + (Number(goal.targetAmount) || 0),
    0
  );

  const totalSaved = goals.reduce(
    (sum, goal) => sum + (Number(goal.savedAmount) || 0),
    0
  );

  const remainingTarget = Math.max(totalTarget - totalSaved, 0);

  const completedGoalsCount = goals.filter(
    (goal) => (Number(goal.savedAmount) || 0) >= (Number(goal.targetAmount) || 0) && (Number(goal.targetAmount) || 0) > 0
  ).length;

  return (
    <div className="module-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Savings Goals</h1>
          <p>Plan your savings milestones and monitor target progress.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="module-summary-grid">
        <div className="module-summary-card">
          <span>Total Target Amount</span>
          <h2>{formatCurrency(totalTarget, currency)}</h2>
          <small className="summary-card-subtext">Across {goals.length} goals</small>
        </div>

        <div className="module-summary-card">
          <span>Total Saved So Far</span>
          <h2 className="positive">{formatCurrency(totalSaved, currency)}</h2>
          <small className="summary-card-subtext">
            {totalTarget > 0 ? `${((totalSaved / totalTarget) * 100).toFixed(1)}% of total target` : "0%"}
          </small>
        </div>

        <div className="module-summary-card">
          <span>Remaining to Save</span>
          <h2>{formatCurrency(remainingTarget, currency)}</h2>
          <small className="summary-card-subtext">Target deficit</small>
        </div>

        <div className="module-summary-card">
          <span>Completed Goals</span>
          <h2>
            {completedGoalsCount} / {goals.length}
          </h2>
          <small className="summary-card-subtext">
            {goals.length > 0
              ? `${((completedGoalsCount / goals.length) * 100).toFixed(0)}% achievement rate`
              : "No goals"}
          </small>
        </div>
      </div>

      {/* Goal Form */}
      <GoalForm
        key={editingGoal ? editingGoal.id : "new"}
        onSave={handleSave}
        editingGoal={editingGoal}
        onCancel={() => setEditingGoal(null)}
        currencySymbol={currencyInfo.symbol}
      />

      {/* Goal List */}
      <div className="module-section-heading">
        <h2>Active Goals & Targets</h2>
        <span>{goals.length} goals</span>
      </div>

      <GoalList
        goals={goals}
        currency={currency}
        onEdit={setEditingGoal}
        onDelete={(goal) => setDeletingGoal(goal)}
        onContribute={(goal) => setContributingGoal(goal)}
      />

      {/* Contribution Modal */}
      <ContributionModal
        isOpen={Boolean(contributingGoal)}
        onClose={() => setContributingGoal(null)}
        goal={contributingGoal}
        currency={currency}
        onSubmit={handleContributeSubmit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingGoal)}
        onClose={() => setDeletingGoal(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Savings Goal"
        message={`Are you sure you want to delete the goal "${deletingGoal?.title}" (${formatCurrency(deletingGoal?.targetAmount || 0, currency)})?`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}

export default SavingsGoals;
