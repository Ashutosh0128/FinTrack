import { useState } from "react";
import Modal from "../../components/common/Modal";
import { formatCurrency } from "../../utils/formatters";
import { CURRENCIES } from "../../utils/constants";

export function ContributionModal({
  isOpen,
  onClose,
  goal,
  currency = "INR",
  onSubmit
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  if (!goal) return null;

  const target = Number(goal.targetAmount) || 0;
  const saved = Number(goal.savedAmount) || 0;
  const remaining = Math.max(target - saved, 0);
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.INR;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      setError("Please enter a valid contribution amount greater than zero.");
      return;
    }

    if (numAmount > remaining) {
      setError(
        `Contribution cannot exceed the remaining target of ${formatCurrency(
          remaining,
          currency
        )}.`
      );
      return;
    }

    onSubmit(goal, numAmount);
    setAmount("");
    setError("");
    onClose();
  };

  const handleQuickAdd = (val) => {
    const nextVal = Math.min(val, remaining);
    setAmount(String(nextVal));
    if (error) setError("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setAmount("");
        setError("");
        onClose();
      }}
      title={`Add Contribution`}
      subtitle={`Deposit funds towards "${goal.title}"`}
      maxWidth="460px"
    >
      <form onSubmit={handleSubmit} className="contribution-modal-form">
        <div className="contribution-goal-summary">
          <div>
            <span>Saved</span>
            <strong>{formatCurrency(saved, currency)}</strong>
          </div>
          <div className="divider" />
          <div>
            <span>Remaining Target</span>
            <strong className="positive">{formatCurrency(remaining, currency)}</strong>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: "16px" }}>
          <label htmlFor="contrib-amount">Contribution Amount ({currencyInfo.symbol}) *</label>
          <input
            id="contrib-amount"
            type="number"
            min="1"
            max={remaining}
            step="any"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (error) setError("");
            }}
            autoFocus
            required
          />
        </div>

        {/* Quick fill chips */}
        <div className="quick-amount-chips">
          {[500, 1000, 2500, 5000].map((preset) => {
            if (preset > remaining) return null;
            return (
              <button
                key={preset}
                type="button"
                className="chip-btn"
                onClick={() => handleQuickAdd(preset)}
              >
                +{formatCurrency(preset, currency)}
              </button>
            );
          })}
          <button
            type="button"
            className="chip-btn chip-fill-all"
            onClick={() => handleQuickAdd(remaining)}
          >
            Full Remaining
          </button>
        </div>

        {error && <p className="form-error" style={{ marginTop: "12px" }}>{error}</p>}

        <div className="form-actions" style={{ marginTop: "24px" }}>
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            Deposit to Goal
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ContributionModal;

