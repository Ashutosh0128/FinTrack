import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";
import { formatCurrency } from "../../utils/formatters";

const COLORS = [
  "#22C55E",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#A78BFA",
  "#06B6D4",
  "#EC4899",
  "#10B981"
];

function CategoryChart({ data, currency = "INR", subtitle = "Understand where your money goes" }) {
  return (
    <div className="dashboard-panel">
      <div className="panel-heading">
        <div>
          <h3>Expense Categories</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      {data && data.length > 0 ? (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="45%"
                outerRadius={95}
                innerRadius={45}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.category || index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => formatCurrency(value, currency)}
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
        <div className="empty-state">No expense transactions recorded for this period.</div>
      )}
    </div>
  );
}

export default CategoryChart;
