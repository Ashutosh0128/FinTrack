export const initialData = {
  user: {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    role: "Personal Account"
  },

  settings: {
    currency: "INR"
  },

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
    {
      id: "txn_5",
      title: "November Salary",
      amount: 48000,
      type: "income",
      category: "Salary",
      date: "2026-11-01",
      paymentMethod: "Bank Transfer",
      notes: "November salary credited",
    },
    {
      id: "txn_6",
      title: "Supermarket Groceries",
      amount: 3200,
      type: "expense",
      category: "Food",
      date: "2026-11-02",
      paymentMethod: "UPI",
      notes: "Provisions & fruits",
    },
    {
      id: "txn_7",
      title: "Weekend Dining & Coffee",
      amount: 1450,
      type: "expense",
      category: "Food",
      date: "2026-11-03",
      paymentMethod: "Debit Card",
      notes: "Bistro dinner",
    },
    {
      id: "txn_8",
      title: "Metro Smartcard Recharge",
      amount: 800,
      type: "expense",
      category: "Travel",
      date: "2026-11-02",
      paymentMethod: "UPI",
      notes: "Commute recharge",
    }
  ],

  budgets: [
    {
      id: "budget_1",
      category: "Food",
      limit: 8000,
      month: "2026-11",
    },
    {
      id: "budget_2",
      category: "Shopping",
      limit: 5000,
      month: "2026-11",
    },
    {
      id: "budget_3",
      category: "Travel",
      limit: 4000,
      month: "2026-11",
    },
    {
      id: "budget_4",
      category: "Bills",
      limit: 3500,
      month: "2026-11",
    }
  ],

  goals: [
    {
      id: "goal_1",
      title: "New Laptop",
      targetAmount: 60000,
      savedAmount: 25000,
      deadline: "2027-03-31",
    },
    {
      id: "goal_2",
      title: "Emergency Fund",
      targetAmount: 100000,
      savedAmount: 45000,
      deadline: "2027-06-30",
    },
  ],

  notifications: [
    {
      id: "notif_welcome",
      title: "Welcome to FinTrack",
      message: "Your personal finance dashboard is ready to track income, expenses, and savings.",
      date: "2026-11-01T09:00:00.000Z",
      read: false
    }
  ],
};
