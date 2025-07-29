/**
 * Utility functions for currency converter CLI
 */

/**
 * Validates if amount is a valid positive number
 * @param {string} amount - Amount to validate
 * @returns {boolean} - True if valid
 */
function isValidAmount(amount) {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && isFinite(num);
}

/**
 * Validates if currency code is in correct format (3 letters)
 * @param {string} currency - Currency code to validate
 * @returns {boolean} - True if valid format
 */
function isValidCurrencyFormat(currency) {
  return /^[A-Z]{3}$/.test(currency);
}

/**
 * Formats number to display with appropriate decimal places
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted amount
 */
function formatAmount(amount) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats currency display with symbol and code
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount, currency) {
  return `${formatAmount(amount)} ${currency}`;
}

/**
 * Displays success message with checkmark
 * @param {string} message - Message to display
 */
function showSuccess(message) {
  console.log(`✓ ${message}`);
}

/**
 * Displays error message with X mark
 * @param {string} message - Error message to display
 */
function showError(message) {
  console.log(`❌ ${message}`);
}

/**
 * Displays info message
 * @param {string} message - Info message to display
 */
function showInfo(message) {
  console.log(`ℹ️  ${message}`);
}

/**
 * Converts string to uppercase for currency codes
 * @param {string} currency - Currency code to convert
 * @returns {string} - Uppercase currency code
 */
function normalizeCurrency(currency) {
  return currency.trim().toUpperCase();
}

/**
 * Gets popular currency examples for user guidance
 * @returns {string} - Examples string
 */
function getCurrencyExamples() {
  return "USD, EUR, RWF";
}

/**
 * Validates and parses amount input
 * @param {string} input - User input for amount
 * @returns {object} - {isValid: boolean, value: number, error: string}
 */
function parseAmount(input) {
  if (!input || input.trim() === "") {
    return {
      isValid: false,
      value: 0,
      error: "Amount cannot be empty",
    };
  }

  const amount = parseFloat(input.trim());

  if (isNaN(amount)) {
    return {
      isValid: false,
      value: 0,
      error: "Please enter a valid number",
    };
  }

  if (amount <= 0) {
    return {
      isValid: false,
      value: 0,
      error: "Amount must be greater than 0",
    };
  }

  if (!isFinite(amount)) {
    return {
      isValid: false,
      value: 0,
      error: "Amount is too large",
    };
  }

  return {
    isValid: true,
    value: amount,
    error: null,
  };
}

/**
 * Validates currency code input
 * @param {string} input - User input for currency
 * @returns {object} - {isValid: boolean, value: string, error: string}
 */
function parseCurrency(input) {
  if (!input || input.trim() === "") {
    return {
      isValid: false,
      value: "",
      error: "Currency code cannot be empty",
    };
  }

  const currency = normalizeCurrency(input);

  if (!isValidCurrencyFormat(currency)) {
    return {
      isValid: false,
      value: currency,
      error: `Invalid format. Use 3-letter codes like: ${getCurrencyExamples()}`,
    };
  }

  return {
    isValid: true,
    value: currency,
    error: null,
  };
}

module.exports = {
  isValidAmount,
  isValidCurrencyFormat,
  formatAmount,
  formatCurrency,
  showSuccess,
  showError,
  showInfo,
  normalizeCurrency,
  getCurrencyExamples,
  parseAmount,
  parseCurrency,
};
