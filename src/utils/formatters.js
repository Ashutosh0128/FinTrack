import { CURRENCIES } from "./constants";

/**
 * Format a number into currency representation.
 * Defaults to INR (₹) and handles invalid or empty inputs safely.
 */
export const formatCurrency = (amount, currencyCode = "INR", options = {}) => {
  const numericAmount = Number(amount);
  const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;
  const currencyInfo = CURRENCIES[currencyCode] || CURRENCIES.INR;

  const defaultDecimals = options.decimals !== undefined ? options.decimals : 0;

  try {
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: "currency",
      currency: currencyInfo.code,
      minimumFractionDigits: defaultDecimals,
      maximumFractionDigits: defaultDecimals,
      ...options
    }).format(safeAmount);
  } catch {
    // Fallback if Intl fails
    return `${currencyInfo.symbol}${safeAmount.toLocaleString()}`;
  }
};

/**
 * Safe date formatter. Accepts YYYY-MM-DD or ISO strings.
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "—";

  try {
    // If string is YYYY-MM-DD, parse year, month, day to avoid timezone drift
    if (typeof dateString === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...options
      });
    }

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return String(dateString);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...options
    });
  } catch {
    return String(dateString);
  }
};

/**
 * Format YYYY-MM into human-readable month string (e.g., "November 2026").
 */
export const formatMonthYear = (monthString, short = false) => {
  if (!monthString) return "";
  try {
    const [year, month] = monthString.split("-").map(Number);
    if (!year || !month) return monthString;
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString("en-IN", {
      month: short ? "short" : "long",
      year: "numeric"
    });
  } catch {
    return monthString;
  }
};

/**
 * Extract 1-2 letter initials from a user's full name.
 */
export const getInitials = (name) => {
  if (!name || typeof name !== "string") return "FT";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

