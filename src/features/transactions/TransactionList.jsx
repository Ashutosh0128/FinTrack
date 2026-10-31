import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from "lucide-react";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <h3>No transactions found</h3>
        <p>Try changing your filters or add a new transaction.</p>
      </div>
    );
  }

  return (
    <div className="transaction-table-wrapper">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Category</th>
            <th>Date</th>
            <th>Payment</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>
                <div className="transaction-name">
                  <span
                    className={`transaction-icon ${transaction.type}`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowDownLeft size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </span>

                  <div>
                    <strong>{transaction.title}</strong>
                    <small>{transaction.notes || "No notes"}</small>
                  </div>
                </div>
              </td>

              <td>{transaction.category}</td>

              <td>
                {new Date(
                  `${transaction.date}T00:00:00`
                ).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              <td>{transaction.paymentMethod}</td>

              <td
                className={
                  transaction.type === "income"
                    ? "income-amount"
                    : "expense-amount"
                }
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </td>

              <td>
                <div className="table-actions">
                  <button
                    className="icon-button"
                    onClick={() => onEdit(transaction)}
                    aria-label="Edit transaction"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="icon-button delete-icon"
                    onClick={() => onDelete(transaction.id)}
                    aria-label="Delete transaction"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;