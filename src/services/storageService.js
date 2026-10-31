import { initialData } from "../data/initialData";

const STORAGE_KEY = "fintrack_data";

export const getStoredData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (data) {
      return {
        ...initialData,
        ...JSON.parse(data),
      };
    }

    return initialData;
  } catch (error) {
    console.error("Error loading data:", error);
    return initialData;
  }
};

export const saveStoredData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export const clearStoredData = () => {
  localStorage.removeItem(STORAGE_KEY);
};