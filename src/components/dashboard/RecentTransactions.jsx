import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

function RecentTransactions({ transactions }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="dashboard-panel recent-transactions">
      <div className="panel-heading">
        <div>
          <h3>Recent Transactions</h3>
          <p>Your latest financial activities</p>
        </div>
      </div>

      {recentTransactions.length > 0 ? (
        <div className="recent-list">
          {recentTransactions.map((transaction) => (
            <div
              className="recent-item"
              key={transaction.id}
            >
              <div className={`transaction-type-icon ${transaction.type}`}>
                {transaction.type === "income" ? (
                  <ArrowDownLeft size={19} />
                ) : (
                  <ArrowUpRight size={19} />
                )}
              </div>

              <div className="recent-info">
                <h4>{transaction.title}</h4>
                <p>
                  {transaction.category} · {transaction.date}
                </p>
              </div>

              <strong className={transaction.type}>
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </strong>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-state">
          No transactions yet. Add your first transaction to get started.
        </p>
      )}
    </div>
  );
}

export default RecentTransactions;