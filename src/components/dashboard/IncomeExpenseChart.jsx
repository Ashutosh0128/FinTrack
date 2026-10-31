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

const data = [
  { month: "May", income: 35000, expense: 18000 },
  { month: "Jun", income: 42000, expense: 22000 },
  { month: "Jul", income: 38000, expense: 25000 },
  { month: "Aug", income: 50000, expense: 28000 },
  { month: "Sep", income: 45000, expense: 20000 },
  { month: "Oct", income: 55000, expense: 26000 }
];

function IncomeExpenseChart() {
  return (
    <div className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <h3>Income vs Expenses</h3>
          <p>Monthly financial comparison</p>
        </div>
        <span className="chart-period">Last 6 months</span>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8}>
            <CartesianGrid
              stroke="#273140"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              stroke="#94A3B8"
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              stroke="#94A3B8"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />

            <Tooltip
              contentStyle={{
                background: "#161D27",
                border: "1px solid #273140",
                borderRadius: "10px",
                color: "#F1F5F9"
              }}
              formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
            />

            <Legend />

            <Bar
              dataKey="income"
              name="Income"
              fill="#22C55E"
              radius={[5, 5, 0, 0]}
            />

            <Bar
              dataKey="expense"
              name="Expenses"
              fill="#F87171"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default IncomeExpenseChart;