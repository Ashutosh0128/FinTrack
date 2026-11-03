import { useState } from "react";
import { getTodayDateString } from "../../utils/calculations";

function GoalForm({ onSave, editingGoal, onCancel, currencySymbol = "₹" }) {
  const [title, setTitle] = useState(() => editingGoal?.title || "");
  const [targetAmount, setTargetAmount] = useState(
    () => (editingGoal?.targetAmount ? String(editingGoal.targetAmount) : "")
  );
  const [savedAmount, setSavedAmount] = useState(
    () => (editingGoal?.savedAmount !== undefined ? String(editingGoal.savedAmount) : "0")
  );
  const [deadline, setDeadline] = useState(
    () => editingGoal?.deadline || ""
  );
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanTitle = title.trim();
    const target = Number(targetAmount);
    const saved = Number(savedAmount);

    if (!cleanTitle) {
      setError("Please enter a goal title.");
      return;
    }

    if (!Number.isFinite(target) || target <= 0) {
      setError("Target amount must be a valid number greater than zero.");
      return;
    }

    if (!Number.isFinite(saved) || saved < 0) {
      setError("Already saved amount cannot be negative.");
      return;
    }

    if (saved > target) {
      setError("Saved amount cannot exceed the target amount.");
      return;
    }

    if (!deadline) {
      setError("Please select a target deadline.");
      return;
    }

    onSave({
      title: cleanTitle,
      targetAmount: target,
      savedAmount: saved,
      deadline
    });
  };

  return (
    <form className="module-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <h3>{editingGoal ? "Edit Savings Goal" : "Create Savings Goal"}</h3>
          <p>Define a financial milestone and track progress towards your target.</p>
        </div>
      </div>

      <div className="form-grid">
        <label htmlFor="goal-name">
          Goal Title *
          <input
            id="goal-name"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. Emergency Fund, New Laptop, Vacation"
            required
          />
        </label>

        <label htmlFor="goal-target">
          Target Amount ({currencySymbol}) *
          <input
            id="goal-target"
            type="number"
            min="1"
            step="any"
            value={targetAmount}
            onChange={(e) => {
              setTargetAmount(e.target.value);
              if (error) setError("");
            }}
            placeholder="0.00"
            required
          />
        </label>

        <label htmlFor="goal-saved">
          Already Saved ({currencySymbol})
          <input
            id="goal-saved"
            type="number"
            min="0"
            step="any"
            value={savedAmount}
            onChange={(e) => {
              setSavedAmount(e.target.value);
              if (error) setError("");
            }}
            placeholder="0.00"
          />
        </label>

        <label htmlFor="goal-deadline">
          Target Deadline *
          <input
            id="goal-deadline"
            type="date"
            min={getTodayDateString()}
            value={deadline}
            onChange={(e) => {
              setDeadline(e.target.value);
              if (error) setError("");
            }}
            required
          />
        </label>
      </div>

      {error && <p className="form-error" style={{ marginTop: "12px" }}>{error}</p>}

      <div className="form-actions">
        <button className="primary-btn" type="submit">
          {editingGoal ? "Update Goal" : "Create Goal"}
        </button>

        {editingGoal && (
          <button className="secondary-btn" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default GoalForm;
