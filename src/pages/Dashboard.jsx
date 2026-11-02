import { useMemo } from "react";

import { useFinance } from "../context/FinanceContext";
import { calculateTotals } from "../utils/calculations";

import SummaryCard from "../components/dashboard/SummaryCard";
import IncomeExpenseChart from "../components/dashboard/IncomeExpenseChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";

function Dashboard() {
  const { state } = useFinance();

  const transactions = state.transactions || [];
  const budgets = state.budgets || [];
  const goals = state.goals || [];

  const totals = useMemo(() => {
    return calculateTotals(transactions);
  }, [transactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Generate income and expense data for the last six months.
  const monthlyData = useMemo(() => {
    const result = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() - i,
        1
      );

      const year = date.getFullYear();
      const month = date.getMonth();

      let income = 0;
      let expenses = 0;

      transactions.forEach((transaction) => {
        const transactionDate = new Date(
          `${transaction.date}T00:00:00`
        );

        if (
          transactionDate.getFullYear() === year &&
          transactionDate.getMonth() === month
        ) {
          if (transaction.type === "income") {
            income += Number(transaction.amount);
          } else {
            expenses += Number(transaction.amount);
          }
        }
      });

      result.push({
        month: date.toLocaleString("en-IN", {
          month: "short"
        }),
        income,
        expenses
      });
    }

    return result;
  }, [transactions]);

  // Calculate expense category totals for the current month.
  const categoryData = useMemo(() => {
    const today = new Date();

    const currentMonthTransactions = transactions.filter(
      (transaction) => {
        const date = new Date(`${transaction.date}T00:00:00`);

        return (
          transaction.type === "expense" &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      }
    );

    const categoryTotals = {};

    currentMonthTransactions.forEach((transaction) => {
      const category = transaction.category;

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        Number(transaction.amount);
    });

    return Object.entries(categoryTotals).map(
      ([category, amount]) => ({
        category,
        amount
      })
    );
  }, [transactions]);

  const currentMonth = new Date().toLocaleString("en-IN", {
    month: "long",
    year: "numeric"
  });

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Here's an overview of your finances.</p>
        </div>

        <span className="dashboard-date">
          {currentMonth}
        </span>
      </div>

      <div className="summary-grid">
        <SummaryCard
          title="Net Balance"
          value={formatCurrency(totals.balance)}
          type="balance"
        />

        <SummaryCard
          title="Total Income"
          value={formatCurrency(totals.income)}
          type="income"
        />

        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(totals.expenses)}
          type="expense"
        />

        <SummaryCard
          title="Net Savings"
          value={formatCurrency(totals.savings)}
          type="savings"
        />
      </div>

      <div className="dashboard-charts">
        <IncomeExpenseChart data={monthlyData} />
        <CategoryChart data={categoryData} />
      </div>

      <div className="dashboard-bottom">
        <RecentTransactions transactions={transactions} />

        <div className="dashboard-panel overview-panel">
          <div className="panel-heading">
            <div>
              <h3>Financial Overview</h3>
              <p>Your current progress</p>
            </div>
          </div>

          <div className="overview-item">
            <span>Active Budgets</span>
            <strong>{budgets.length}</strong>
          </div>

          <div className="overview-item">
            <span>Savings Goals</span>
            <strong>{goals.length}</strong>
          </div>

          <div className="overview-item">
            <span>Savings Rate</span>
            <strong>{totals.savingsRate.toFixed(1)}%</strong>
          </div>

          <div className="overview-item">
            <span>Total Transactions</span>
            <strong>{transactions.length}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;