import { useEffect, useState } from "react";

const categories = [
  "Food",
  "Shopping",
  "Travel",
  "Bills",
  "Entertainment",
  "Healthcare",
  "Education",
  "Other"
];

function BudgetForm({ onSave, editingBudget, onCancel }) {
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("");
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    if (editingBudget) {
      setCategory(editingBudget.category);
      setLimit(String(editingBudget.limit));
      setMonth(editingBudget.month);
    } else {
      setCategory("Food");
      setLimit("");
      setMonth(new Date().toISOString().slice(0, 7));
    }
  }, [editingBudget]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const amount = Number(limit);

    if (!category || !month || !Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid category, month and budget limit.");
      return;
    }

    onSave({
      category,
      limit: amount,
      month
    });

    setLimit("");
  };

  return (
    <form className="module-form" onSubmit={handleSubmit}>
      <h3>{editingBudget ? "Edit Budget" : "Create New Budget"}</h3>

      <div className="form-grid">
        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label>
          Monthly Limit (₹)
          <input
            type="number"
            min="1"
            step="0.01"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="Enter budget amount"
            required
          />
        </label>

        <label>
          Budget Month
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />
        </label>
      </div>

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