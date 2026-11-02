import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

function IncomeExpenseChart({ data }) {
  const formatAmount = (value) => {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  return (
    <div className="dashboard-panel">
      <div className="panel-heading">
        <div>
          <h3>Income vs Expenses</h3>
          <p>Your financial activity over the last 6 months</p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#273140"
              />

              <XAxis
                dataKey="month"
                stroke="#94A3B8"
              />

              <YAxis
                stroke="#94A3B8"
                tickFormatter={(value) => `₹${value}`}
              />

              <Tooltip
                formatter={formatAmount}
                contentStyle={{
                  background: "#111720",
                  border: "1px solid #273140",
                  borderRadius: "8px",
                  color: "#F1F5F9"
                }}
              />

              <Legend />

              <Bar
                dataKey="income"
                name="Income"
                fill="#22C55E"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="#EF4444"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="empty-state">No transaction data available.</p>
      )}
    </div>
  );
}

export default IncomeExpenseChart;