#!/usr/bin/env node

/**
 * Currency Converter CLI - Main Application
 * A simple, interactive command-line currency converter
 */

const { convertCurrency, isApiKeyConfigured } = require("./api");
const { runInteractiveMode, showApiKeyInstructions } = require("./prompts");
const { showError } = require("./utils");

/**
 * Main application entry point
 */
async function main() {
  try {
    // Check if API key is configured
    if (!isApiKeyConfigured()) {
      showError("API key not found or not configured properly");
      showApiKeyInstructions();
      process.exit(1);
    }

    // Start interactive mode
    await runInteractiveMode(convertCurrency);
  } catch (error) {
    console.error("");
    showError(`Application error: ${error.message}`);
    console.error("");
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("");
  showError("An unexpected error occurred");
  console.error("Details:", reason);
  console.error("");
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("");
  showError("A critical error occurred");
  console.error("Details:", error.message);
  console.error("");
  process.exit(1);
});

// Run the application
if (require.main === module) {
  main();
}

module.exports = {
  main,
};
