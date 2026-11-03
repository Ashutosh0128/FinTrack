export function financeReducer(state, action) {
  if (!state) return state;

  switch (action.type) {
    // TRANSACTIONS
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...(state.transactions || [])]
      };

    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: (state.transactions || []).map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        )
      };

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: (state.transactions || []).filter(
          (item) => item.id !== action.payload
        )
      };

    // BUDGETS
    case "ADD_BUDGET":
      return {
        ...state,
        budgets: [...(state.budgets || []), action.payload]
      };

    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: (state.budgets || []).map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        )
      };

    case "DELETE_BUDGET":
      return {
        ...state,
        budgets: (state.budgets || []).filter(
          (item) => item.id !== action.payload
        )
      };

    // SAVINGS GOALS
    case "ADD_GOAL":
      return {
        ...state,
        goals: [...(state.goals || []), action.payload]
      };

    case "UPDATE_GOAL":
      return {
        ...state,
        goals: (state.goals || []).map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        )
      };

    case "DELETE_GOAL":
      return {
        ...state,
        goals: (state.goals || []).filter(
          (item) => item.id !== action.payload
        )
      };

    // NOTIFICATIONS
    case "ADD_NOTIFICATION": {
      // Prevent duplicate notification by message or id
      const existing = (state.notifications || []).some(
        (n) => n.id === action.payload.id || (n.message === action.payload.message && !n.read)
      );
      if (existing) return state;

      return {
        ...state,
        notifications: [action.payload, ...(state.notifications || [])]
      };
    }

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: (state.notifications || []).map((item) =>
          item.id === action.payload ? { ...item, read: true } : item
        )
      };

    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: (state.notifications || []).map((item) => ({
          ...item,
          read: true
        }))
      };

    case "CLEAR_NOTIFICATIONS":
      return {
        ...state,
        notifications: []
      };

    // USER PROFILE
    case "UPDATE_USER_PROFILE":
      return {
        ...state,
        user: {
          ...(state.user || {}),
          ...action.payload
        }
      };

    // SETTINGS (CURRENCY, etc.)
    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: {
          ...(state.settings || {}),
          ...action.payload
        }
      };

    // RESET APPLICATION DATA
    case "RESET_DATA":
      return {
        ...action.payload
      };

    default:
      return state;
  }
}
