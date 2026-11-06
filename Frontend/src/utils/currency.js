/**
 * Currency and Price Utility
 * Formats prices cleanly across the entire store consistently without ad-hoc calculations.
 */

export const formatPrice = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const getEffectivePrice = (sellingPrice, discount = 0) => {
  const base = parseFloat(sellingPrice) || 0;
  const disc = parseFloat(discount) || 0;
  if (disc <= 0) return base;
  return base * (1 - disc / 100);
};

export const getSavingsAmount = (sellingPrice, discount = 0) => {
  const base = parseFloat(sellingPrice) || 0;
  const disc = parseFloat(discount) || 0;
  if (disc <= 0) return 0;
  return base * (disc / 100);
};

