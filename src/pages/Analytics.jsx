import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { useFinance } from "../context/FinanceContext";

const COLORS = [
  "#22C55E",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#A78BFA",
  "#06B6D4",
  "#EC4899"
];

function Analytics() {
  const { state } = useFinance();
  const transactions = state.transactions || [];

  const [period, setPeriod] = useState("6");

  const monthlyData = useMemo(() => {
    const result = [];
    const today = new Date();

    for (let i = Number(period) - 1; i >= 0; i--) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() - i,
        1
      );

      let income = 0;
      let expenses = 0;

      transactions.forEach((transaction) => {
        const transactionDate = new Date(`${transaction.date}T00:00:00`);

        if (
          transactionDate.getFullYear() === date.getFullYear() &&
          transactionDate.getMonth() === date.getMonth()
        ) {
          if (transaction.type === "income") {
            income += Number(transaction.amount);
          } else {
            expenses += Number(transaction.amount);
          }
        }
      });

      result.push({
        month: date.toLocaleString("en-IN", { month: "short" }),
        income,
        expenses,
        savings: income - expenses
      });
    }

    return result;
  }, [transactions, period]);

  const categoryData = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const totals = {};

    transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.date.slice(0, 7) === currentMonth
      )
      .forEach((transaction) => {
        totals[transaction.category] =
          (totals[transaction.category] || 0) +
          Number(transaction.amount);
      });

    return Object.entries(totals).map(([category, amount]) => ({
      category,
      amount
    }));
  }, [transactions]);

  const totalIncome = monthlyData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = monthlyData.reduce((sum, item) => sum + item.expenses, 0);
  const totalSavings = totalIncome - totalExpenses;

  const savingsRate =
    totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  const currency = (value) =>
    `₹${Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 0
    })}`;

  return (
    <div className="module-page">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Understand your financial performance and spending habits.</p>
        </div>

        <select
          className="period-select"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="3">Last 3 months</option>
          <option value="6">Last 6 months</option>
          <option value="12">Last 12 months</option>
        </select>
      </div>

      <div className="module-summary-grid">
        <div className="module-summary-card">
          <span>Total Income</span>
          <h2>{currency(totalIncome)}</h2>
        </div>

        <div className="module-summary-card">
          <span>Total Expenses</span>
          <h2>{currency(totalExpenses)}</h2>
        </div>

        <div className="module-summary-card">
          <span>Net Savings</span>
          <h2>{currency(totalSavings)}</h2>
        </div>

        <div className="module-summary-card">
          <span>Savings Rate</span>
          <h2>{savingsRate.toFixed(1)}%</h2>
        </div>
      </div>

      <div className="analytics-chart-grid">
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Monthly Financial Comparison</h3>
              <p>Income and expenses over time</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#273140" />
              <XAxis dataKey="month" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#22C55E" name="Income" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Spending Breakdown</h3>
              <p>Current month's expense categories</p>
            </div>
          </div>

          {categoryData.length ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="amount"
                  nameKey="category"
                  outerRadius={105}
                  label
                >
                  {categoryData.map((item, index) => (
                    <Cell
                      key={item.category}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="empty-state">No expenses available for this month.</p>
          )}
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <h3>Monthly Report</h3>
            <p>Detailed financial summary</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="module-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Income</th>
                <th>Expenses</th>
                <th>Net Savings</th>
              </tr>
            </thead>

            <tbody>
              {monthlyData.map((item, index) => (
                <tr key={`${item.month}-${index}`}>
                  <td>{item.month}</td>
                  <td className="positive">{currency(item.income)}</td>
                  <td className="negative">{currency(item.expenses)}</td>
                  <td>{currency(item.savings)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;