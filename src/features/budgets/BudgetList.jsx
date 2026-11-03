import { Pencil, Trash2, AlertCircle } from "lucide-react";
import { formatCurrency, formatMonthYear } from "../../utils/formatters";

function BudgetList({
  budgets = [],
  getSpent,
  currency = "INR",
  onEdit,
  onDelete,
  emptyMessage = "No budgets created yet for this period."
}) {
  if (!budgets || budgets.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <div className="budget-grid">
      {budgets.map((budget) => {
        const spent = getSpent(budget);
        const limit = Number(budget.limit) || 0;
        const remaining = limit - spent;
        const percentage = limit > 0 ? (spent / limit) * 100 : 0;
        const progressWidth = Math.min(Math.max(percentage, 0), 100);

        const status =
          percentage >= 100
            ? "over-budget"
            : percentage >= 80
            ? "near-limit"
            : "within-budget";

        return (
          <div className={`budget-card status-${status}`} key={budget.id}>
            <div className="budget-card-heading">
              <div>
                <h3>{budget.category}</h3>
                <p>{formatMonthYear(budget.month)}</p>
              </div>

              <div className="item-actions">
                <button
                  type="button"
                  onClick={() => onEdit(budget)}
                  aria-label={`Edit ${budget.category} budget`}
                  title="Edit budget"
                >
                  <Pencil size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(budget)}
                  aria-label={`Delete ${budget.category} budget`}
                  title="Delete budget"
                  className="delete-icon"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="budget-amounts">
              <div>
                <span>Spent</span>
                <strong>{formatCurrency(spent, currency)}</strong>
              </div>

              <div>
                <span>Monthly Limit</span>
                <strong>{formatCurrency(limit, currency)}</strong>
              </div>
            </div>

            <div className="progress-track">
              <div
                className={`progress-fill ${status}`}
                style={{ width: `${progressWidth}%` }}
              />
            </div>

            <div className="budget-footer">
              <div className="budget-usage-tag">
                {status !== "within-budget" && <AlertCircle size={13} />}
                <span>{percentage.toFixed(1)}% utilized</span>
              </div>

              <strong className={remaining < 0 ? "negative" : "positive"}>
                {remaining >= 0
                  ? `${formatCurrency(remaining, currency)} remaining`
                  : `${formatCurrency(Math.abs(remaining), currency)} over limit`}
              </strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BudgetList;
