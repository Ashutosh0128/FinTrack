import { Pencil, Trash2, Plus, CheckCircle2, Clock } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getTodayDateString } from "../../utils/calculations";

function GoalList({ goals = [], currency = "INR", onEdit, onDelete, onContribute }) {
  if (!goals || goals.length === 0) {
    return (
      <div className="empty-state">
        No savings goals yet. Create your first goal to begin saving!
      </div>
    );
  }

  const todayStr = getTodayDateString();

  return (
    <div className="goal-grid">
      {goals.map((goal) => {
        const target = Number(goal.targetAmount) || 0;
        const saved = Number(goal.savedAmount) || 0;
        const progress = target > 0 ? Math.min((saved / target) * 100, 100) : 0;
        const remaining = Math.max(target - saved, 0);
        const isCompleted = progress >= 100;
        const isOverdue = !isCompleted && goal.deadline && goal.deadline < todayStr;

        return (
          <div className={`goal-card ${isCompleted ? "completed" : ""}`} key={goal.id}>
            <div className="goal-card-heading">
              <div>
                <div className="goal-title-wrapper">
                  <h3>{goal.title}</h3>
                  {isCompleted && (
                    <span className="goal-status-badge completed">
                      <CheckCircle2 size={13} /> Completed
                    </span>
                  )}
                  {isOverdue && (
                    <span className="goal-status-badge overdue">
                      <Clock size={13} /> Overdue
                    </span>
                  )}
                </div>
                <p>Deadline: {formatDate(goal.deadline)}</p>
              </div>

              <div className="item-actions">
                <button
                  type="button"
                  onClick={() => onEdit(goal)}
                  aria-label={`Edit ${goal.title}`}
                  title="Edit goal"
                >
                  <Pencil size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(goal)}
                  aria-label={`Delete ${goal.title}`}
                  title="Delete goal"
                  className="delete-icon"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="goal-amounts">
              <div>
                <span>Saved So Far</span>
                <strong className="positive">{formatCurrency(saved, currency)}</strong>
              </div>

              <div>
                <span>Target Goal</span>
                <strong>{formatCurrency(target, currency)}</strong>
              </div>
            </div>

            <div className="progress-track">
              <div
                className={`progress-fill ${isCompleted ? "completed" : ""}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="goal-progress-info">
              <strong>{progress.toFixed(1)}% completed</strong>
              <span>
                {isCompleted
                  ? "Target reached!"
                  : `${formatCurrency(remaining, currency)} remaining`}
              </span>
            </div>

            {!isCompleted ? (
              <button
                type="button"
                className="secondary-btn contribute-btn"
                onClick={() => onContribute(goal)}
              >
                <Plus size={15} /> Add Contribution
              </button>
            ) : (
              <div className="goal-completed-banner">
                <CheckCircle2 size={16} /> Milestone Achieved
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default GoalList;
