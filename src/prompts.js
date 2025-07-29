/**
 * Interactive prompts for user input
 */

const readlineSync = require("readline-sync");
const {
  parseAmount,
  parseCurrency,
  showError,
  getCurrencyExamples,
} = require("./utils");

/**
 * Prompts user for amount with validation
 * @returns {number} - Valid amount entered by user
 */
function promptForAmount() {
  while (true) {
    const input = readlineSync.question("> Enter amount: ");
    const parsed = parseAmount(input);

    if (parsed.isValid) {
      return parsed.value;
    }

    showError(parsed.error);
  }
}

/**
 * Prompts user for currency code with validation
 * @param {string} type - Type of currency ('From' or 'To')
 * @returns {string} - Valid currency code entered by user
 */
function promptForCurrency(type) {
  const examples = getCurrencyExamples();

  while (true) {
    const prompt = `> ${type} currency (e.g., ${examples}): `;
    const input = readlineSync.question(prompt);
    const parsed = parseCurrency(input);

    if (parsed.isValid) {
      return parsed.value;
    }

    showError(parsed.error);
  }
}

/**
 * Prompts user if they want to perform another conversion
 * @returns {boolean} - True if user wants to continue
 */
function promptForContinue() {
  console.log(); // Add blank line for spacing
  const input = readlineSync.question("> Convert another? (y/n): ");
  return input.toLowerCase().startsWith("y");
}

/**
 * Displays welcome message
 */
function showWelcome() {
  console.log("");
  console.log("💱 Currency Converter CLI");
  console.log("========================");
  console.log("");
}

/**
 * Displays goodbye message
 */
function showGoodbye() {
  console.log("");
  console.log("Goodbye! 👋");
  console.log("");
}

/**
 * Prompts for all conversion inputs
 * @returns {object} - {amount: number, fromCurrency: string, toCurrency: string}
 */
function promptForConversion() {
  const amount = promptForAmount();
  const fromCurrency = promptForCurrency("From");
  const toCurrency = promptForCurrency("To");

  return {
    amount,
    fromCurrency,
    toCurrency,
  };
}

/**
 * Displays conversion result
 * @param {number} amount - Original amount
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {number} result - Converted amount
 * @param {number} rate - Exchange rate used
 */
function showConversionResult(amount, fromCurrency, toCurrency, result, rate) {
  const { formatCurrency, showSuccess } = require("./utils");

  console.log("");
  showSuccess(
    `${formatCurrency(amount, fromCurrency)} = ${formatCurrency(
      result,
      toCurrency
    )}`
  );
  console.log(
    `   Exchange rate: 1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`
  );
}

/**
 * Displays loading message while fetching rates
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 */
function showLoading(fromCurrency, toCurrency) {
  process.stdout.write(
    `⏳ Fetching ${fromCurrency} to ${toCurrency} exchange rate...`
  );
}

/**
 * Clears loading message
 */
function clearLoading() {
  process.stdout.write("\r\x1b[K"); // Clear the line
}

/**
 * Handles user interruption (Ctrl+C)
 */
function setupInterruptHandler() {
  process.on("SIGINT", () => {
    console.log("");
    console.log("");
    showGoodbye();
    process.exit(0);
  });
}

/**
 * Prompts user to press Enter to continue (for error scenarios)
 */
function promptToContinue() {
  readlineSync.question("Press Enter to continue...");
}

/**
 * Shows API key setup instructions
 */
function showApiKeyInstructions() {
  console.log("");
  console.log("🔑 API Key Setup Required");
  console.log("========================");
  console.log("");
  console.log(
    "1. Get a free API key from: https://app.exchangerate-api.com/sign-up"
  );
  console.log("2. Create a .env file in the project root");
  console.log("3. Add this line: EXCHANGE_API_KEY=your_actual_api_key");
  console.log("4. Restart the application");
  console.log("");
}

/**
 * Main interactive loop for the CLI application
 * @param {Function} convertFunction - Function to handle conversion logic
 */
async function runInteractiveMode(convertFunction) {
  setupInterruptHandler();
  showWelcome();

  do {
    try {
      const { amount, fromCurrency, toCurrency } = promptForConversion();

      showLoading(fromCurrency, toCurrency);
      const result = await convertFunction(amount, fromCurrency, toCurrency);
      clearLoading();

      if (result.success) {
        showConversionResult(
          amount,
          fromCurrency,
          toCurrency,
          result.result,
          result.rate
        );
      } else {
        showError(result.error);

        // Show API setup instructions if API key is the issue
        if (result.error.includes("API key")) {
          showApiKeyInstructions();
        }
      }
    } catch (error) {
      clearLoading();
      showError(`Unexpected error: ${error.message}`);
    }
  } while (promptForContinue());

  showGoodbye();
}

module.exports = {
  promptForAmount,
  promptForCurrency,
  promptForContinue,
  promptForConversion,
  showWelcome,
  showGoodbye,
  showConversionResult,
  showLoading,
  clearLoading,
  showApiKeyInstructions,
  runInteractiveMode,
};
