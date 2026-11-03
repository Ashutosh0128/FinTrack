import { Link } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

function RecentTransactions({ transactions = [], currency = "INR" }) {
  const recentTransactions = [...transactions]
    .filter((t) => t && t.date)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 5);

  return (
    <div className="dashboard-panel recent-transactions">
      <div className="panel-heading">
        <div>
          <h3>Recent Transactions</h3>
          <p>Your latest financial activities</p>
        </div>
        <Link to="/transactions" className="panel-link">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {recentTransactions.length > 0 ? (
        <div className="recent-list">
          {recentTransactions.map((transaction) => {
            const isIncome = transaction.type === "income";

            return (
              <div className="recent-item" key={transaction.id}>
                <div className={`transaction-type-icon ${transaction.type}`}>
                  {isIncome ? (
                    <ArrowDownLeft size={19} />
                  ) : (
                    <ArrowUpRight size={19} />
                  )}
                </div>

                <div className="recent-info">
                  <h4>{transaction.title}</h4>
                  <p>
                    {transaction.category} · {formatDate(transaction.date)}
                  </p>
                </div>

                <strong className={transaction.type}>
                  {isIncome ? "+" : "-"}
                  {formatCurrency(transaction.amount, currency)}
                </strong>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          No transactions yet. Add your first transaction to get started.
        </div>
      )}
    </div>
  );
}

export default RecentTransactions;
