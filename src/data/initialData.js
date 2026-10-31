export const initialData = {
  transactions: [
    {
      id: "txn_1",
      title: "Monthly Salary",
      amount: 45000,
      type: "income",
      category: "Salary",
      date: "2026-10-01",
      paymentMethod: "Bank Transfer",
      notes: "October salary",
    },
    {
      id: "txn_2",
      title: "Grocery Shopping",
      amount: 2500,
      type: "expense",
      category: "Food",
      date: "2026-10-05",
      paymentMethod: "UPI",
      notes: "Monthly groceries",
    },
    {
      id: "txn_3",
      title: "Electricity Bill",
      amount: 1800,
      type: "expense",
      category: "Bills",
      date: "2026-10-08",
      paymentMethod: "UPI",
      notes: "Monthly electricity bill",
    },
    {
      id: "txn_4",
      title: "Freelance Payment",
      amount: 8000,
      type: "income",
      category: "Freelance",
      date: "2026-10-12",
      paymentMethod: "Bank Transfer",
      notes: "Website project",
    },
  ],

  budgets: [
    {
      id: "budget_1",
      category: "Food",
      limit: 8000,
      month: "2026-10",
    },
    {
      id: "budget_2",
      category: "Shopping",
      limit: 5000,
      month: "2026-10",
    },
    {
      id: "budget_3",
      category: "Travel",
      limit: 4000,
      month: "2026-10",
    },
  ],

  goals: [
    {
      id: "goal_1",
      title: "New Laptop",
      targetAmount: 60000,
      savedAmount: 15000,
      deadline: "2027-03-31",
    },
    {
      id: "goal_2",
      title: "Emergency Fund",
      targetAmount: 100000,
      savedAmount: 30000,
      deadline: "2027-06-30",
    },
  ],

  notifications: [],
};