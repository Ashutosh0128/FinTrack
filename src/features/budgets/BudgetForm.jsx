import { useState } from "react";
import { ALL_EXPENSE_CATEGORIES } from "../../utils/constants";
import { getCurrentMonthString } from "../../utils/calculations";

function BudgetForm({ onSave, editingBudget, onCancel, currencySymbol = "₹" }) {
  const [category, setCategory] = useState(
    () => editingBudget?.category || ALL_EXPENSE_CATEGORIES[0]
  );
  const [limit, setLimit] = useState(
    () => (editingBudget?.limit ? String(editingBudget.limit) : "")
  );
  const [month, setMonth] = useState(
    () => editingBudget?.month || getCurrentMonthString()
  );
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const amount = Number(limit);

    if (!category) {
      setError("Please select a budget category.");
      return;
    }

    if (!month) {
      setError("Please select a target month.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Please enter a valid monthly limit greater than zero.");
      return;
    }

    onSave({
      category,
      limit: amount,
      month
    });
  };

  return (
    <form className="module-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <h3>{editingBudget ? "Edit Budget Limit" : "Create New Budget"}</h3>
          <p>Assign spending limits to categories for specific months.</p>
        </div>
      </div>

      <div className="form-grid">
        <label htmlFor="budget-category">
          Category *
          <select
            id="budget-category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (error) setError("");
            }}
          >
            {ALL_EXPENSE_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="budget-limit">
          Monthly Limit ({currencySymbol}) *
          <input
            id="budget-limit"
            type="number"
            min="1"
            step="any"
            value={limit}
            onChange={(e) => {
              setLimit(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. 10000"
            required
          />
        </label>

        <label htmlFor="budget-month">
          Target Month *
          <input
            id="budget-month"
            type="month"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              if (error) setError("");
            }}
            required
          />
        </label>
      </div>

      {error && <p className="form-error" style={{ marginTop: "12px" }}>{error}</p>}

      <div className="form-actions">
        <button type="submit" className="primary-btn">
          {editingBudget ? "Update Budget" : "Add Budget"}
        </button>

        {editingBudget && (
          <button type="button" className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default BudgetForm;
