import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const COLORS = [
  "#22C55E",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#A78BFA",
  "#06B6D4",
  "#EC4899"
];

function CategoryChart({ data }) {
  return (
    <div className="dashboard-panel">
      <div className="panel-heading">
        <div>
          <h3>Expense Categories</h3>
          <p>Understand where your money goes</p>
        </div>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="45%"
              outerRadius={95}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.category}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
              contentStyle={{
                background: "#111720",
                border: "1px solid #273140",
                borderRadius: "8px"
              }}
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="empty-state">No expenses recorded yet.</p>
      )}
    </div>
  );
}

export default CategoryChart;