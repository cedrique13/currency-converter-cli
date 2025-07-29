/**
 * API service for fetching exchange rates
 */

const axios = require("axios");
require("dotenv").config();

const BASE_URL = "https://v6.exchangerate-api.com/v6";
const API_KEY = process.env.EXCHANGE_API_KEY;

/**
 * Validates if API key is configured
 * @returns {boolean} - True if API key exists
 */
function isApiKeyConfigured() {
  return API_KEY && API_KEY !== "api_key";
}

/**
 * Fetches exchange rate between two currencies
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {Promise<object>} - {success: boolean, rate: number, error: string}
 */
async function getExchangeRate(fromCurrency, toCurrency) {
  if (!isApiKeyConfigured()) {
    return {
      success: false,
      rate: 0,
      error: "API key not configured. Please check your .env file",
    };
  }

  try {
    const url = `${BASE_URL}/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;

    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
      headers: {
        "User-Agent": "Currency-Converter-CLI/1.0",
      },
    });

    const data = response.data;

    // Check API response status
    if (data.result === "success") {
      return {
        success: true,
        rate: data.conversion_rate,
        error: null,
      };
    } else {
      // Handle API-specific errors
      return {
        success: false,
        rate: 0,
        error: getApiErrorMessage(data["error-type"]),
      };
    }
  } catch (error) {
    return {
      success: false,
      rate: 0,
      error: getNetworkErrorMessage(error),
    };
  }
}

/**
 * Fetches all supported currencies
 * @returns {Promise<object>} - {success: boolean, currencies: array, error: string}
 */
async function getSupportedCurrencies() {
  if (!isApiKeyConfigured()) {
    return {
      success: false,
      currencies: [],
      error: "API key not configured",
    };
  }

  try {
    const url = `${BASE_URL}/${API_KEY}/codes`;

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Currency-Converter-CLI/1.0",
      },
    });

    const data = response.data;

    if (data.result === "success") {
      // Extract just the currency codes
      const currencies = data.supported_codes.map((code) => code[0]);
      return {
        success: true,
        currencies: currencies,
        error: null,
      };
    } else {
      return {
        success: false,
        currencies: [],
        error: getApiErrorMessage(data["error-type"]),
      };
    }
  } catch (error) {
    return {
      success: false,
      currencies: [],
      error: getNetworkErrorMessage(error),
    };
  }
}

/**
 * Converts API error types to user-friendly messages
 * @param {string} errorType - API error type
 * @returns {string} - User-friendly error message
 */
function getApiErrorMessage(errorType) {
  const errorMessages = {
    "unsupported-code":
      "Currency code not supported. Try: USD, EUR, GBP, JPY, etc.",
    "malformed-request": "Invalid request format",
    "invalid-key": "Invalid API key",
    "inactive-account": "API account is inactive",
    "quota-reached": "API quota exceeded. Please try again later",
    "base-code-only-on-pro": "This currency requires a pro account",
    "unsupported-currency": "Currency not supported by the API",
  };

  return errorMessages[errorType] || `API Error: ${errorType}`;
}

/**
 * Converts network errors to user-friendly messages
 * @param {Error} error - Network error object
 * @returns {string} - User-friendly error message
 */
function getNetworkErrorMessage(error) {
  if (error.code === "ECONNABORTED") {
    return "Request timeout. Please check your internet connection";
  }

  if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
    return "Cannot connect to exchange rate service. Please check your internet connection";
  }

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    if (status === 401) {
      return "Invalid API key. Please check your .env file";
    } else if (status === 403) {
      return "Access forbidden. Please check your API key permissions";
    } else if (status === 429) {
      return "Too many requests. Please wait a moment and try again";
    } else if (status >= 500) {
      return "Exchange rate service is temporarily unavailable";
    }
    return `HTTP Error ${status}`;
  }

  return `Network error: ${error.message}`;
}

/**
 * Performs currency conversion calculation
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @returns {Promise<object>} - {success: boolean, result: number, rate: number, error: string}
 */
async function convertCurrency(amount, fromCurrency, toCurrency) {
  // Handle same currency conversion
  if (fromCurrency === toCurrency) {
    return {
      success: true,
      result: amount,
      rate: 1,
      error: null,
    };
  }

  const rateData = await getExchangeRate(fromCurrency, toCurrency);

  if (!rateData.success) {
    return {
      success: false,
      result: 0,
      rate: 0,
      error: rateData.error,
    };
  }

  const convertedAmount = amount * rateData.rate;

  return {
    success: true,
    result: convertedAmount,
    rate: rateData.rate,
    error: null,
  };
}

module.exports = {
  isApiKeyConfigured,
  getExchangeRate,
  getSupportedCurrencies,
  convertCurrency,
};
