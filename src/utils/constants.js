export const CATEGORIES = {
  income: ["Salary", "Freelance", "Business", "Investment", "Other"],
  expense: [
    "Food",
    "Shopping",
    "Travel",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Other"
  ]
};

export const ALL_EXPENSE_CATEGORIES = CATEGORIES.expense;
export const ALL_INCOME_CATEGORIES = CATEGORIES.income;

export const ALL_CATEGORIES = [
  ...CATEGORIES.income,
  ...CATEGORIES.expense.filter((cat) => !CATEGORIES.income.includes(cat))
];

export const PAYMENT_METHODS = [
  "UPI",
  "Bank Transfer",
  "Credit Card",
  "Debit Card",
  "Cash"
];

export const CURRENCIES = {
  INR: {
    code: "INR",
    symbol: "₹",
    locale: "en-IN",
    name: "Indian Rupee (INR ₹)"
  },
  USD: {
    code: "USD",
    symbol: "$",
    locale: "en-US",
    name: "US Dollar (USD $)"
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    locale: "de-DE",
    name: "Euro (EUR €)"
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    locale: "en-GB",
    name: "British Pound (GBP £)"
  }
};

