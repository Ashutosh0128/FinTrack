import { Pencil, Trash2 } from "lucide-react";

function BudgetList({ budgets, getSpent, onEdit, onDelete }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);

  if (budgets.length === 0) {
    return (
      <div className="empty-state">
        No budgets created yet. Create your first monthly budget.
      </div>
    );
  }

  return (
    <div className="budget-grid">
      {budgets.map((budget) => {
        const spent = getSpent(budget);
        const remaining = budget.limit - spent;
        const percentage = (spent / budget.limit) * 100;
        const progress = Math.min(percentage, 100);

        const status =
          percentage >= 100 ? "over-budget" :
          percentage >= 80 ? "near-limit" : "within-budget";

        return (
          <div className="budget-card" key={budget.id}>
            <div className="budget-card-heading">
              <div>
                <h3>{budget.category}</h3>
                <p>{budget.month}</p>
              </div>

              <div className="item-actions">
                <button onClick={() => onEdit(budget)} aria-label="Edit budget">
                  <Pencil size={17} />
                </button>

                <button onClick={() => onDelete(budget.id)} aria-label="Delete budget">
                  <Trash2 size={17} />
                </button>
              </div>
            </div>

            <div className="budget-amounts">
              <div>
                <span>Spent</span>
                <strong>{formatCurrency(spent)}</strong>
              </div>

              <div>
                <span>Limit</span>
                <strong>{formatCurrency(budget.limit)}</strong>
              </div>
            </div>

            <div className="progress-track">
              <div
                className={`progress-fill ${status}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="budget-footer">
              <span>{percentage.toFixed(1)}% used</span>
              <strong className={remaining < 0 ? "negative" : "positive"}>
                {remaining >= 0
                  ? `${formatCurrency(remaining)} remaining`
                  : `${formatCurrency(Math.abs(remaining))} over budget`}
              </strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BudgetList;