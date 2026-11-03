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
import { formatCurrency } from "../../utils/formatters";

function IncomeExpenseChart({ data, currency = "INR" }) {
  const formatAmount = (value) => formatCurrency(value, currency);

  return (
    <div className="dashboard-panel">
      <div className="panel-heading">
        <div>
          <h3>Income vs Expenses</h3>
          <p>Financial activity over the last 6 months</p>
        </div>
      </div>

      {data && data.length > 0 ? (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#273140" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" tick={{ fill: "#94A3B8", fontSize: 12 }} />
              <YAxis
                stroke="#94A3B8"
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                tickFormatter={(value) => formatCurrency(value, currency, { notation: "compact" })}
              />
              <Tooltip
                formatter={formatAmount}
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
      ) : (
        <div className="empty-state">No transaction data available for the chart.</div>
      )}
    </div>
  );
}

export default IncomeExpenseChart;
