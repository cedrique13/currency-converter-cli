#!/usr/bin/env node

/**
 * Web Server for Currency Converter CLI
 * Provides HTTP interface for the currency converter
 */

const express = require("express");
const { convertCurrency, isApiKeyConfigured } = require("./api");
const { showError } = require("./utils");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Currency Converter API",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint with HTML interface
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Currency Converter - Cedrick13</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                padding: 30px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }
            h1 {
                text-align: center;
                margin-bottom: 30px;
                font-size: 2.5em;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            input, select {
                width: 100%;
                padding: 12px;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                background: rgba(255, 255, 255, 0.9);
                color: #333;
            }
            button {
                width: 100%;
                padding: 15px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 18px;
                cursor: pointer;
                transition: background 0.3s;
            }
            button:hover {
                background: #45a049;
            }
            .result {
                margin-top: 20px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                text-align: center;
                font-size: 18px;
            }
            .error {
                background: rgba(255, 0, 0, 0.2);
                color: #ffebee;
            }
            .success {
                background: rgba(76, 175, 80, 0.2);
                color: #e8f5e8;
            }
            .server-info {
                text-align: center;
                margin-top: 30px;
                font-size: 14px;
                opacity: 0.8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>💱 Currency Converter</h1>
            <form id="converterForm">
                <div class="form-group">
                    <label for="amount">Amount:</label>
                    <input type="number" id="amount" name="amount" step="0.01" min="0" required>
                </div>
                <div class="form-group">
                    <label for="fromCurrency">From Currency:</label>
                    <select id="fromCurrency" name="fromCurrency" required>
                        <option value="">Select currency</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                        <option value="RWF">RWF - Rwandan Franc</option>
                        <option value="CHF">CHF - Swiss Franc</option>
                        <option value="CNY">CNY - Chinese Yuan</option>
                        <option value="INR">INR - Indian Rupee</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="toCurrency">To Currency:</label>
                    <select id="toCurrency" name="toCurrency" required>
                        <option value="">Select currency</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                        <option value="RWF">RWF - Rwandan Franc</option>
                        <option value="CHF">CHF - Swiss Franc</option>
                        <option value="CNY">CNY - Chinese Yuan</option>
                        <option value="INR">INR - Indian Rupee</option>
                    </select>
                </div>
                <button type="submit">Convert Currency</button>
            </form>
            <div id="result"></div>
            <div class="server-info">
                <p>🚀 Powered by Cedrick13's Currency Converter</p>
                <p>💻 Server: ${process.env.HOSTNAME || "Unknown"}</p>
                <p>⏰ Time: <span id="currentTime"></span></p>
            </div>
        </div>

        <script>
            document.getElementById('currentTime').textContent = new Date().toLocaleString();
            
            document.getElementById('converterForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const amount = document.getElementById('amount').value;
                const fromCurrency = document.getElementById('fromCurrency').value;
                const toCurrency = document.getElementById('toCurrency').value;
                
                const resultDiv = document.getElementById('result');
                resultDiv.innerHTML = '<div class="result">Converting...</div>';
                
                try {
                    const response = await fetch('/convert', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            amount: parseFloat(amount),
                            fromCurrency: fromCurrency,
                            toCurrency: toCurrency
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        resultDiv.innerHTML = \`
                            <div class="result success">
                                <h3>✓ Conversion Result</h3>
                                <p><strong>\${amount} \${fromCurrency} = \${data.result.toFixed(2)} \${toCurrency}</strong></p>
                                <p>Exchange Rate: 1 \${fromCurrency} = \${data.rate.toFixed(6)} \${toCurrency}</p>
                            </div>
                        \`;
                    } else {
                        resultDiv.innerHTML = \`
                            <div class="result error">
                                <h3>❌ Error</h3>
                                <p>\${data.error}</p>
                            </div>
                        \`;
                    }
                } catch (error) {
                    resultDiv.innerHTML = \`
                        <div class="result error">
                            <h3>❌ Network Error</h3>
                            <p>Unable to connect to the server. Please try again.</p>
                        </div>
                    \`;
                }
            });
        </script>
    </body>
    </html>
  `);
});

// API endpoint for currency conversion
app.post("/convert", async (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency } = req.body;

    if (!amount || !fromCurrency || !toCurrency) {
      return res.json({
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
      });
    } else {
      res.json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      error: `Server error: ${error.message}`,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`💱 Currency Converter Web Server`);
  console.log(`===============================`);
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📱 Web interface: http://localhost:${PORT}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

module.exports = app;
