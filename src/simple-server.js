#!/usr/bin/env node

/**
 * Simple HTTP Server for Currency Converter
 * Minimal wrapper to meet assignment requirements
 */

const express = require("express");
const { convertCurrency, isApiKeyConfigured } = require("./api");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Currency Converter API",
    timestamp: new Date().toISOString(),
    server: process.env.HOSTNAME || "Unknown",
  });
});

// Root endpoint - simple response
app.get("/", (req, res) => {
  res.json({
    message: "Currency Converter API",
    endpoints: {
      health: "/health",
      convert: "/convert (POST)",
    },
    usage:
      "Send POST request to /convert with amount, fromCurrency, toCurrency",
  });
});

// Convert endpoint
app.post("/convert", async (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency } = req.body;

    if (!amount || !fromCurrency || !toCurrency) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameters: amount, fromCurrency, toCurrency",
      });
    }

    const result = await convertCurrency(amount, fromCurrency, toCurrency);

    if (result.success) {
      res.json({
        success: true,
        result: result.result,
        rate: result.rate,
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
        message: `${amount} ${fromCurrency} = ${result.result.toFixed(
          2
        )} ${toCurrency}`,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Server error: ${error.message}`,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`💱 Currency Converter API`);
  console.log(`========================`);
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

module.exports = app;
