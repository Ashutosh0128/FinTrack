import { useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES, PAYMENT_METHODS } from "../../utils/constants";
import { getTodayDateString } from "../../utils/calculations";

const TransactionForm = ({ onSave, onClose, transaction, currencySymbol = "₹" }) => {
  const [formData, setFormData] = useState(() => {
    if (transaction) {
      return {
        title: transaction.title || "",
        amount: String(transaction.amount || ""),
        type: transaction.type || "expense",
        category: transaction.category || CATEGORIES.expense[0],
        date: transaction.date || getTodayDateString(),
        paymentMethod: transaction.paymentMethod || "UPI",
        notes: transaction.notes || ""
      };
    }
    return {
      title: "",
      amount: "",
      type: "expense",
      category: CATEGORIES.expense[0],
      date: getTodayDateString(),
      paymentMethod: "UPI",
      notes: ""
    };
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: value
      };

      // Automatically sync category when type changes
      if (name === "type") {
        const availableCategories = CATEGORIES[value] || CATEGORIES.expense;
        updated.category = availableCategories[0];
      }

      return updated;
    });

    if (error) setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanTitle = formData.title.trim();
    const amount = Number(formData.amount);

    if (!cleanTitle) {
      setError("Please enter a transaction title.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    if (!formData.date) {
      setError("Please select a transaction date.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    onSave({
      ...formData,
      title: cleanTitle,
      amount
    });
  };

  const availableCategories = CATEGORIES[formData.type] || CATEGORIES.expense;

  return (
    <div className="transaction-form-card">
      <div className="form-heading">
        <div>
          <h2>{transaction ? "Edit Transaction" : "Add New Transaction"}</h2>
          <p>Enter the transaction information below.</p>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label="Close form"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="tx-title">Transaction Title *</label>
          <input
            id="tx-title"
            type="text"
            name="title"
            placeholder="e.g. Grocery Shopping, Client Invoice"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tx-amount">Amount ({currencySymbol}) *</label>
            <input
              id="tx-amount"
              type="number"
              name="amount"
              placeholder="0.00"
              min="0.01"
              step="any"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tx-type">Transaction Type *</label>
            <select
              id="tx-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="expense">Expense (-)</option>
              <option value="income">Income (+)</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tx-category">Category *</label>
            <select
              id="tx-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tx-date">Date *</label>
            <input
              id="tx-date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tx-payment">Payment Method</label>
            <select
              id="tx-payment"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tx-notes">Notes (Optional)</label>
            <input
              id="tx-notes"
              type="text"
              name="notes"
              placeholder="Receipt details, tags, etc."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button type="submit" className="primary-btn">
            {transaction ? "Update Transaction" : "Save Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
