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

import { useFinance } from "../hooks/useFinance";
import { formatCurrency, formatMonthYear } from "../utils/formatters";

const COLORS = [
  "#22C55E",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#A78BFA",
  "#06B6D4",
  "#EC4899",
  "#14B8A6"
];

function Analytics() {
  const { state, currency } = useFinance();
  const [currentDate] = useState(() => new Date());
  const transactions = state?.transactions;

  const [period, setPeriod] = useState("6"); // "3" | "6" | "12"

  // Generate monthly timeline data based on selected period
  const monthlyData = useMemo(() => {
    const result = [];
    const count = Number(period) || 6;
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const txList = transactions || [];

    for (let i = count - 1; i >= 0; i--) {
      const targetDate = new Date(currentYear, currentMonth - i, 1);
      const targetYear = targetDate.getFullYear();
      const targetMonthIndex = targetDate.getMonth();
      const monthKey = `${targetYear}-${String(targetMonthIndex + 1).padStart(2, "0")}`;

      let income = 0;
      let expenses = 0;

      txList.forEach((tx) => {
        if (!tx || !tx.date) return;
        const txMonthKey = tx.date.slice(0, 7);

        if (txMonthKey === monthKey) {
          const amt = Number(tx.amount) || 0;
          if (tx.type === "income") {
            income += amt;
          } else if (tx.type === "expense") {
            expenses += amt;
          }
        }
      });

      result.push({
        monthKey,
        month: targetDate.toLocaleDateString("en-IN", {
          month: "short",
          year: count > 6 ? "2-digit" : undefined
        }),
        monthFull: formatMonthYear(monthKey),
        income,
        expenses,
        savings: income - expenses
      });
    }

    return result;
  }, [transactions, period, currentDate]);

  // Category breakdown for the selected period window
  const categoryData = useMemo(() => {
    const validMonthKeys = new Set(monthlyData.map((m) => m.monthKey));
    const totals = {};
    const txList = transactions || [];

    txList.forEach((tx) => {
      if (!tx || tx.type !== "expense" || !tx.date) return;
      const txMonthKey = tx.date.slice(0, 7);

      if (validMonthKeys.has(txMonthKey)) {
        const cat = tx.category || "Other";
        const amt = Number(tx.amount) || 0;
        totals[cat] = (totals[cat] || 0) + amt;
      }
    });

    return Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, monthlyData]);

  // Aggregate totals across the period
  const totalIncome = monthlyData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = monthlyData.reduce((sum, item) => sum + item.expenses, 0);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.max(0, (totalSavings / totalIncome) * 100) : 0;

  const tooltipFormatter = (value) => formatCurrency(value, currency);

  return (
    <div className="module-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Financial Analytics</h1>
          <p>Analyze trends, cash flow, and category breakdowns across periods.</p>
        </div>

        <div className="header-filter-group">
          <label htmlFor="period-filter-select" className="filter-label">Timeframe:</label>
          <select
            id="period-filter-select"
            className="period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="3">Last 3 Months</option>
            <option value="6">Last 6 Months</option>
            <option value="12">Last 12 Months</option>
          </select>
        </div>
      </div>

      {/* Aggregate KPI Summary Cards */}
      <div className="module-summary-grid">
        <div className="module-summary-card">
          <span>Total Income</span>
          <h2>{formatCurrency(totalIncome, currency)}</h2>
          <small className="summary-card-subtext">Past {period} months</small>
        </div>

        <div className="module-summary-card">
          <span>Total Expenses</span>
          <h2>{formatCurrency(totalExpenses, currency)}</h2>
          <small className="summary-card-subtext">Past {period} months</small>
        </div>

        <div className="module-summary-card">
          <span>Net Savings</span>
          <h2 className={totalSavings < 0 ? "negative" : "positive"}>
            {formatCurrency(totalSavings, currency)}
          </h2>
          <small className="summary-card-subtext">
            {totalSavings >= 0 ? "Net surplus" : "Net deficit"}
          </small>
        </div>

        <div className="module-summary-card">
          <span>Savings Rate</span>
          <h2>{savingsRate.toFixed(1)}%</h2>
          <small className="summary-card-subtext">Savings to income ratio</small>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-chart-grid">
        {/* Income vs Expenses Bar Chart */}
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Monthly Income vs Expenses</h3>
              <p>Cash flow trajectory over the last {period} months</p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#273140" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <YAxis
                  stroke="#94A3B8"
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  tickFormatter={(val) => formatCurrency(val, currency, { notation: "compact" })}
                />
                <Tooltip
                  formatter={tooltipFormatter}
                  contentStyle={{
                    background: "#111720",
                    border: "1px solid #273140",
                    borderRadius: "8px",
                    color: "#F1F5F9",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Bar dataKey="income" name="Income" fill="#22C55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown Pie Chart */}
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Expense Breakdown</h3>
              <p>Category distribution over last {period} months</p>
            </div>
          </div>

          {categoryData.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="45%"
                    outerRadius={95}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {categoryData.map((item, index) => (
                      <Cell
                        key={item.category || index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={tooltipFormatter}
                    contentStyle={{
                      background: "#111720",
                      border: "1px solid #273140",
                      borderRadius: "8px",
                      color: "#F1F5F9",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">
              No expense records found in the last {period} months.
            </div>
          )}
        </div>
      </div>

      {/* Monthly Report Data Table */}
      <div className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <h3>Monthly Financial Breakdown</h3>
            <p>Summary table of monthly cash flow and savings performance</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="module-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Total Income</th>
                <th>Total Expenses</th>
                <th>Net Savings</th>
                <th>Savings Rate</th>
              </tr>
            </thead>

            <tbody>
              {monthlyData.map((item) => {
                const itemSavingsRate =
                  item.income > 0 ? Math.max(0, (item.savings / item.income) * 100) : 0;

                return (
                  <tr key={item.monthKey}>
                    <td>
                      <strong>{item.monthFull}</strong>
                    </td>
                    <td className="positive">
                      +{formatCurrency(item.income, currency)}
                    </td>
                    <td className="negative">
                      -{formatCurrency(item.expenses, currency)}
                    </td>
                    <td className={item.savings >= 0 ? "positive" : "negative"}>
                      <strong>
                        {item.savings >= 0 ? "+" : ""}
                        {formatCurrency(item.savings, currency)}
                      </strong>
                    </td>
                    <td>
                      <span>{itemSavingsRate.toFixed(1)}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
