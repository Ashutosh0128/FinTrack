import { Pencil, Trash2, Plus } from "lucide-react";

function GoalList({ goals, onEdit, onDelete, onContribute }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);

  if (!goals.length) {
    return (
      <div className="empty-state">
        No savings goals yet. Create your first goal.
      </div>
    );
  }

  return (
    <div className="goal-grid">
      {goals.map((goal) => {
        const progress = Math.min(
          (goal.savedAmount / goal.targetAmount) * 100,
          100
        );

        const remaining = Math.max(
          goal.targetAmount - goal.savedAmount,
          0
        );

        const completed = progress >= 100;

        return (
          <div className="goal-card" key={goal.id}>
            <div className="goal-card-heading">
              <div>
                <h3>{goal.title}</h3>
                <p>Deadline: {goal.deadline}</p>
              </div>

              <div className="item-actions">
                <button onClick={() => onEdit(goal)} aria-label="Edit goal">
                  <Pencil size={17} />
                </button>

                <button onClick={() => onDelete(goal.id)} aria-label="Delete goal">
                  <Trash2 size={17} />
                </button>
              </div>
            </div>

            <div className="goal-amounts">
              <div>
                <span>Saved</span>
                <strong>{formatCurrency(goal.savedAmount)}</strong>
              </div>

              <div>
                <span>Target</span>
                <strong>{formatCurrency(goal.targetAmount)}</strong>
              </div>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="goal-progress-info">
              <strong>{progress.toFixed(1)}% completed</strong>
              <span>{formatCurrency(remaining)} remaining</span>
            </div>

            {completed ? (
              <span className="goal-completed">Goal completed</span>
            ) : (
              <button
                className="secondary-btn contribute-btn"
                onClick={() => onContribute(goal)}
              >
                <Plus size={16} /> Add Contribution
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default GoalList;