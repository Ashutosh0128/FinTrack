import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

const transactions = [
  {
    id: 1,
    title: "Monthly Salary",
    category: "Income",
    date: "31 Oct 2026",
    amount: 45000,
    type: "income"
  },
  {
    id: 2,
    title: "Grocery Shopping",
    category: "Food",
    date: "29 Oct 2026",
    amount: 2500,
    type: "expense"
  },
  {
    id: 3,
    title: "Electricity Bill",
    category: "Utilities",
    date: "27 Oct 2026",
    amount: 1800,
    type: "expense"
  },
  {
    id: 4,
    title: "Freelance Project",
    category: "Other Income",
    date: "25 Oct 2026",
    amount: 8000,
    type: "income"
  }
];

function RecentTransactions() {
  return (
    <div className="panel transactions-panel">
      <div className="panel-heading">
        <div>
          <h3>Recent Transactions</h3>
          <p>Your latest financial activity</p>
        </div>
      </div>

      <div className="transaction-list">
        {transactions.map((item) => (
          <div className="transaction-row" key={item.id}>
            <div className={`transaction-icon ${item.type}`}>
              {item.type === "income" ? (
                <ArrowDownLeft size={19} />
              ) : (
                <ArrowUpRight size={19} />
              )}
            </div>

            <div className="transaction-details">
              <strong>{item.title}</strong>
              <small>{item.category} · {item.date}</small>
            </div>

            <strong className={`transaction-amount ${item.type}`}>
              {item.type === "income" ? "+" : "-"}
              ₹{item.amount.toLocaleString("en-IN")}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentTransactions;