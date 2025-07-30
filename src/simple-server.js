#!/usr/bin/env node

/**
 * Simple HTTP Server for Currency Converter
 * Minimal wrapper to meet assignment requirements
 */

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { convertCurrency, isApiKeyConfigured } = require("./api");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Currency Converter API",
      version: "1.0.0",
      description:
        "A simple API for currency conversion using real-time exchange rates",
      contact: {
        name: "Cedrick13",
        url: "https://github.com/cedrique13/currency-converter-cli",
      },
    },
    servers: [
      {
        url: "https://cedrique13-cli.onrender.com",
        description: "Production server",
      },
      {
        url: "http://localhost:8080",
        description: "Local development server",
      },
    ],
  },
  apis: ["./src/simple-server.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 service:
 *                   type: string
 *                   example: "Currency Converter API"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-30T06:05:04.074Z"
 *                 server:
 *                   type: string
 *                   example: "render-app-123"
 */
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Currency Converter API",
    timestamp: new Date().toISOString(),
    server: process.env.HOSTNAME || "Unknown",
  });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: API information
 *     description: Returns information about the API endpoints
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Currency Converter API"
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     health:
 *                       type: string
 *                       example: "/health"
 *                     convert:
 *                       type: string
 *                       example: "/convert (POST)"
 *                 usage:
 *                   type: string
 *                   example: "Send POST request to /convert with amount, fromCurrency, toCurrency"
 */
app.get("/", (req, res) => {
  res.json({
    message: "Currency Converter API",
    endpoints: {
      health: "/health",
      convert: "/convert (POST)",
      docs: "/api-docs",
    },
    usage:
      "Send POST request to /convert with amount, fromCurrency, toCurrency",
  });
});

/**
 * @swagger
 * /convert:
 *   post:
 *     summary: Convert currency
 *     description: Convert an amount from one currency to another using real-time exchange rates
 *     tags: [Conversion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - fromCurrency
 *               - toCurrency
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Amount to convert
 *                 example: 100
 *               fromCurrency:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 3
 *                 description: Source currency code (3 letters)
 *                 example: "USD"
 *               toCurrency:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 3
 *                 description: Target currency code (3 letters)
 *                 example: "EUR"
 *     responses:
 *       200:
 *         description: Successful conversion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: number
 *                   description: Converted amount
 *                   example: 86.56
 *                 rate:
 *                   type: number
 *                   description: Exchange rate used
 *                   example: 0.8656
 *                 fromCurrency:
 *                   type: string
 *                   example: "USD"
 *                 toCurrency:
 *                   type: string
 *                   example: "EUR"
 *                 message:
 *                   type: string
 *                   example: "100 USD = 86.56 EUR"
 *       400:
 *         description: Bad request - missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Missing required parameters: amount, fromCurrency, toCurrency"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Server error: Network timeout"
 */
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
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

module.exports = app;
