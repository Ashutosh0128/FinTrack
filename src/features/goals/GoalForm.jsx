import { useEffect, useState } from "react";

function GoalForm({ onSave, editingGoal, onCancel }) {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("0");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setTargetAmount(String(editingGoal.targetAmount));
      setSavedAmount(String(editingGoal.savedAmount));
      setDeadline(editingGoal.deadline);
    } else {
      setTitle("");
      setTargetAmount("");
      setSavedAmount("0");
      setDeadline("");
    }
  }, [editingGoal]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const target = Number(targetAmount);
    const saved = Number(savedAmount);

    if (
      !title.trim() ||
      !Number.isFinite(target) ||
      !Number.isFinite(saved) ||
      target <= 0 ||
      saved < 0 ||
      saved > target ||
      !deadline
    ) {
      alert("Please enter valid goal details. Saved amount cannot exceed the target.");
      return;
    }

    onSave({
      title: title.trim(),
      targetAmount: target,
      savedAmount: saved,
      deadline
    });

    if (!editingGoal) {
      setTitle("");
      setTargetAmount("");
      setSavedAmount("0");
      setDeadline("");
    }
  };

  return (
    <form className="module-form" onSubmit={handleSubmit}>
      <h3>{editingGoal ? "Edit Savings Goal" : "Create Savings Goal"}</h3>

      <div className="form-grid">
        <label>
          Goal Name
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: New Laptop"
            required
          />
        </label>

        <label>
          Target Amount (₹)
          <input
            type="number"
            min="1"
            step="0.01"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
          />
        </label>

        <label>
          Already Saved (₹)
          <input
            type="number"
            min="0"
            step="0.01"
            value={savedAmount}
            onChange={(e) => setSavedAmount(e.target.value)}
            required
          />
        </label>

        <label>
          Target Deadline
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </label>
      </div>

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