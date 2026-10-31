const financeReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };

    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id
            ? action.payload
            : transaction
        ),
      };

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        ),
      };

    case "ADD_BUDGET":
      return {
        ...state,
        budgets: [...state.budgets, action.payload],
      };

    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.map((budget) =>
          budget.id === action.payload.id ? action.payload : budget
        ),
      };

    case "DELETE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.filter(
          (budget) => budget.id !== action.payload
        ),
      };

    case "ADD_GOAL":
      return {
        ...state,
        goals: [...state.goals, action.payload],
      };

    case "UPDATE_GOAL":
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === action.payload.id ? action.payload : goal
        ),
      };

    case "DELETE_GOAL":
      return {
        ...state,
        goals: state.goals.filter(
          (goal) => goal.id !== action.payload
        ),
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };

    case "RESET_DATA":
      return action.payload;

    default:
      return state;
  }
};

export default financeReducer;