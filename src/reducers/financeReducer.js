export function financeReducer(state, action) {
  switch (action.type) {
    // TRANSACTIONS
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };

    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((item) =>
          item.id === action.payload.id ? action.payload : item
        )
      };

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(
          (item) => item.id !== action.payload
        )
      };

    // BUDGETS
    case "ADD_BUDGET":
      return {
        ...state,
        budgets: [...state.budgets, action.payload]
      };

    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.map((item) =>
          item.id === action.payload.id ? action.payload : item
        )
      };

    case "DELETE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.filter(
          (item) => item.id !== action.payload
        )
      };

    // SAVINGS GOALS
    case "ADD_GOAL":
      return {
        ...state,
        goals: [...state.goals, action.payload]
      };

    case "UPDATE_GOAL":
      return {
        ...state,
        goals: state.goals.map((item) =>
          item.id === action.payload.id ? action.payload : item
        )
      };

    case "DELETE_GOAL":
      return {
        ...state,
        goals: state.goals.filter(
          (item) => item.id !== action.payload
        )
      };

    // NOTIFICATIONS
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [
          action.payload,
          ...(state.notifications || [])
        ]
      };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((item) =>
          item.id === action.payload
            ? { ...item, read: true }
            : item
        )
      };

    case "CLEAR_NOTIFICATIONS":
      return {
        ...state,
        notifications: []
      };

    // RESET
    case "RESET_DATA":
      return {
        ...action.payload
      };

    default:
      return state;
  }
}