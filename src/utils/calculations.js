/**
 * Calculate financial totals (income, expenses, savings, savings rate).
 */
export const calculateTotals = (transactions = []) => {
  if (!Array.isArray(transactions)) {
    return {
      income: 0,
      expenses: 0,
      savings: 0,
      balance: 0,
      savingsRate: 0,
    };
  }

  const income = transactions
    .filter((item) => item && item.type === "income")
    .reduce((total, item) => {
      const val = Number(item.amount);
      return total + (Number.isFinite(val) ? val : 0);
    }, 0);

  const expenses = transactions
    .filter((item) => item && item.type === "expense")
    .reduce((total, item) => {
      const val = Number(item.amount);
      return total + (Number.isFinite(val) ? val : 0);
    }, 0);

  const savings = income - expenses;
  const savingsRate = income > 0 ? Math.max(0, (savings / income) * 100) : 0;

  return {
    income,
    expenses,
    savings,
    balance: savings,
    savingsRate,
  };
};

/**
 * Calculate budget usage percentage safely.
 */
export const calculateBudgetUsage = (spent, limit) => {
  const numLimit = Number(limit);
  const numSpent = Number(spent);

  if (!Number.isFinite(numLimit) || numLimit <= 0) return 0;
  if (!Number.isFinite(numSpent) || numSpent <= 0) return 0;

  return (numSpent / numLimit) * 100;
};

/**
 * Calculate goal progress percentage safely, capped at 100.
 */
export const calculateGoalProgress = (saved, target) => {
  const numTarget = Number(target);
  const numSaved = Number(saved);

  if (!Number.isFinite(numTarget) || numTarget <= 0) return 0;
  if (!Number.isFinite(numSaved) || numSaved <= 0) return 0;

  return Math.min((numSaved / numTarget) * 100, 100);
};

/**
 * Get category expenses for a list of transactions, optionally filtered by month (YYYY-MM).
 */
export const getCategoryExpenses = (transactions = [], monthFilter = null) => {
  if (!Array.isArray(transactions)) return {};

  return transactions
    .filter((item) => {
      if (!item || item.type !== "expense") return false;
      if (monthFilter && typeof item.date === "string") {
        return item.date.slice(0, 7) === monthFilter;
      }
      return true;
    })
    .reduce((result, item) => {
      const amount = Number(item.amount);
      if (Number.isFinite(amount) && amount > 0) {
        result[item.category] = (result[item.category] || 0) + amount;
      }
      return result;
    }, {});
};

/**
 * Get the current month in YYYY-MM format in local timezone.
 */
export const getCurrentMonthString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

/**
 * Get today's date in YYYY-MM-DD format in local timezone.
 */
export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
