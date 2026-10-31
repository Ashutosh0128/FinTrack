import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank
} from "lucide-react";

import SummaryCard from "../components/dashboard/SummaryCard";
import IncomeExpenseChart from "../components/dashboard/IncomeExpenseChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";

function Dashboard() {
  return (
    <div className="dashboard">

      <div className="welcome-section">
        <div>
          <h1>Welcome back! 👋</h1>
          <p>Here's what's happening with your finances.</p>
        </div>

        <button className="primary-button">
          + Add Transaction
        </button>
      </div>

      <div className="summary-grid">

        <SummaryCard
          title="Total Balance"
          amount="₹78,500"
          icon={<Wallet size={21} />}
          color="green"
          subtitle="Your available balance"
        />

        <SummaryCard
          title="Total Income"
          amount="₹55,000"
          icon={<TrendingUp size={21} />}
          color="blue"
          subtitle="This month"
        />

        <SummaryCard
          title="Total Expenses"
          amount="₹26,000"
          icon={<TrendingDown size={21} />}
          color="red"
          subtitle="This month"
        />

        <SummaryCard
          title="Total Savings"
          amount="₹29,000"
          icon={<PiggyBank size={21} />}
          color="purple"
          subtitle="This month's savings"
        />

      </div>

      <div className="dashboard-grid">
        <IncomeExpenseChart />
        <RecentTransactions />
      </div>

    </div>
  );
}

export default Dashboard;