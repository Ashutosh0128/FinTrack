import { useEffect, useState } from "react";
import { X } from "lucide-react";

const categories = {
  income: ["Salary", "Freelance", "Business", "Investment", "Other"],
  expense: [
    "Food",
    "Shopping",
    "Travel",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Other",
  ],
};

const today = new Date().toLocaleDateString("en-CA");

const emptyForm = {
  title: "",
  amount: "",
  type: "expense",
  category: "Food",
  date: today,
  paymentMethod: "UPI",
  notes: "",
};

const TransactionForm = ({ onSave, onClose, transaction }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        amount: String(transaction.amount),
      });
    } else {
      setFormData(emptyForm);
    }

    setError("");
  }, [transaction]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "type"
        ? { category: categories[value][0] }
        : {}),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const amount = Number(formData.amount);

    if (!formData.title.trim()) {
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

    onSave({
      ...formData,
      title: formData.title.trim(),
      amount,
    });
  };

  return (
    <div className="transaction-form-card">
      <div className="form-heading">
        <div>
          <h2>{transaction ? "Edit Transaction" : "Add Transaction"}</h2>
          <p>Enter your transaction details below.</p>
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
          <label>Transaction Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Grocery Shopping"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Transaction Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories[formData.type].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        <div className="form-group">
          <label>Notes (Optional)</label>
          <textarea
            name="notes"
            placeholder="Add additional details..."
            rows="3"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button type="submit" className="primary-button">
            {transaction ? "Update Transaction" : "Save Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;