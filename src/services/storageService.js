import { initialData } from "../data/initialData";

const STORAGE_KEY = "fintrack_data";
const LEGACY_PROFILE_KEY = "fintrack_profile";
const LEGACY_SETTINGS_KEY = "fintrack_settings";

export const getStoredData = () => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    let parsedData = {};

    if (rawData) {
      try {
        parsedData = JSON.parse(rawData);
      } catch (err) {
        console.error("Corrupted localStorage data, resetting to initialData:", err);
        return initialData;
      }
    }

    // Check for legacy separate keys if present
    let legacyProfile = null;
    let legacySettings = null;
    try {
      const rawProf = localStorage.getItem(LEGACY_PROFILE_KEY);
      if (rawProf) legacyProfile = JSON.parse(rawProf);
      const rawSet = localStorage.getItem(LEGACY_SETTINGS_KEY);
      if (rawSet) legacySettings = JSON.parse(rawSet);
    } catch {
      // ignore
    }

    // Merge safely ensuring arrays and objects are present
    const transactions = Array.isArray(parsedData.transactions)
      ? parsedData.transactions
      : initialData.transactions;

    const budgets = Array.isArray(parsedData.budgets)
      ? parsedData.budgets
      : initialData.budgets;

    const goals = Array.isArray(parsedData.goals)
      ? parsedData.goals
      : initialData.goals;

    const notifications = Array.isArray(parsedData.notifications)
      ? parsedData.notifications
      : initialData.notifications;

    const user = {
      ...initialData.user,
      ...(legacyProfile || {}),
      ...(parsedData.user || {})
    };

    const settings = {
      ...initialData.settings,
      ...(legacySettings || {}),
      ...(parsedData.settings || {})
    };

    return {
      transactions,
      budgets,
      goals,
      notifications,
      user,
      settings
    };
  } catch (error) {
    console.error("Error reading stored data:", error);
    return initialData;
  }
};

export const saveStoredData = (data) => {
  try {
    if (!data) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
};

export const clearStoredData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_PROFILE_KEY);
    localStorage.removeItem(LEGACY_SETTINGS_KEY);
  } catch (error) {
    console.error("Error clearing stored data:", error);
  }
};
