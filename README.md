# Currency Converter CLI

A Node.js currency converter with real-time exchange rates and HTTP API endpoints.

## 🌐 Live Demo

- **API**: https://cedrique13-cli.onrender.com/
- **Health**: https://cedrique13-cli.onrender.com/health

## Features

- 💱 Real-time exchange rates via ExchangeRate-API
- Interactive CLI interface
- HTTP API endpoints
- Docker containerized
- Health monitoring
- Comprehensive error handling

## Quick Start

### Local Setup

```bash
# Clone and install
git clone https://github.com/cedrique13/currency-converter-cli.git
cd currency-converter-cli
npm install

# Configure API key
echo "EXCHANGE_API_KEY=your_api_key_here" > .env

# Run CLI mode
npm start

# Run API mode
node src/simple-server.js
```

### Docker

```bash
# Build and run
docker build -t cedrick13bienvenue/currency-converter-cli:v1 .
docker run -p 8080:8080 -e EXCHANGE_API_KEY=your_key cedrick13bienvenue/currency-converter-cli:v1
```

## API Testing with Postman

### 1. Health Check

- **GET** `https://cedrique13-cli.onrender.com/health`

### 2. API Info

- **GET** `https://cedrique13-cli.onrender.com/`

### 3. Convert Currency

- **POST** `https://cedrique13-cli.onrender.com/convert`
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "amount": 100,
  "fromCurrency": "USD",
  "toCurrency": "EUR"
}
```

### 4. Error Testing

- **POST** `https://cedrique13-cli.onrender.com/convert`
- **Body**: `{}` (missing parameters)

## Project Structure

```
src/
├── index.js          # CLI application
├── simple-server.js  # HTTP API server
├── api.js           # ExchangeRate-API integration
├── prompts.js       # User interactions
└── utils.js         # Utilities
```

## Requirements Met

✅ Containerization with Docker  
✅ HTTP endpoints for testing  
✅ Load balancer ready  
✅ Real-time API integration  
✅ Error handling  
✅ Live deployment  
✅ Documentation

---

**Live Demo**: https://cedrique13-cli.onrender.com/
