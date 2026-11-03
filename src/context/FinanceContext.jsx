import {
  useEffect,
  useReducer,
  useMemo
} from "react";

import { FinanceContext } from "./financeContextInstance";
import { financeReducer } from "../reducers/financeReducer";
import { getStoredData, saveStoredData } from "../services/storageService";

const DEFAULT_USER = { name: "User", email: "" };
const DEFAULT_SETTINGS = { currency: "INR" };

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(
    financeReducer,
    undefined,
    getStoredData
  );

  useEffect(() => {
    if (state) {
      saveStoredData(state);
    }
  }, [state]);

  const currency = state?.settings?.currency || DEFAULT_SETTINGS.currency;
  const user = state?.user || DEFAULT_USER;

  const unreadCount = useMemo(() => {
    return (state?.notifications || []).filter((n) => !n.read).length;
  }, [state?.notifications]);

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    currency,
    user,
    unreadCount
  }), [state, dispatch, currency, user, unreadCount]);

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  );
}

export default FinanceProvider;
