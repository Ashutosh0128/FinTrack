import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

import financeReducer from "../reducers/financeReducer";
import { getStoredData, saveStoredData } from "../services/storageService";

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    financeReducer,
    undefined,
    getStoredData
  );

  useEffect(() => {
    saveStoredData(state);
  }, [state]);

  return (
    <FinanceContext.Provider value={{ state, dispatch }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error("useFinance must be used inside FinanceProvider");
  }

  return context;
};