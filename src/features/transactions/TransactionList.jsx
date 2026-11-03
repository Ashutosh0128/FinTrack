import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

const TransactionList = ({
  transactions,
  currency = "INR",
  onEdit,
  onDelete
}) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty-state">
        <h3>No transactions found</h3>
        <p>No records match your active filters or search query.</p>
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
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => {
            const isIncome = transaction.type === "income";

            return (
              <tr key={transaction.id}>
                <td>
                  <div className="transaction-name">
                    <span className={`transaction-icon ${transaction.type}`}>
                      {isIncome ? (
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

                <td>
                  <span className="category-pill">{transaction.category}</span>
                </td>

                <td>{formatDate(transaction.date)}</td>

                <td>
                  <span className="payment-pill">{transaction.paymentMethod || "—"}</span>
                </td>

                <td className={isIncome ? "income-amount" : "expense-amount"}>
                  <strong>
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount, currency)}
                  </strong>
                </td>

                <td>
                  <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => onEdit(transaction)}
                      aria-label="Edit transaction"
                      title="Edit transaction"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      className="icon-button delete-icon"
                      onClick={() => onDelete(transaction)}
                      aria-label="Delete transaction"
                      title="Delete transaction"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
