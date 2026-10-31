export const calculateTotals = (transactions) => {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount), 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  const savings = income - expenses;

  const savingsRate =
    income > 0 ? (savings / income) * 100 : 0;

  return {
    income,
    expenses,
    savings,
    balance: savings,
    savingsRate,
  };
};

export const calculateBudgetUsage = (spent, limit) => {
  if (!limit || limit <= 0) return 0;

  return (spent / limit) * 100;
};

export const calculateGoalProgress = (saved, target) => {
  if (!target || target <= 0) return 0;

  return Math.min((saved / target) * 100, 100);
};

export const getCategoryExpenses = (transactions) => {
  return transactions
    .filter((item) => item.type === "expense")
    .reduce((result, item) => {
      result[item.category] =
        (result[item.category] || 0) + Number(item.amount);

      return result;
    }, {});
};