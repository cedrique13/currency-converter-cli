# Currency Converter CLI

A Node.js currency converter with real-time exchange rates and HTTP API endpoints.

## 🌐 Live Demo

- **API**: https://cedrique13-cli.onrender.com/

## Features

- 💱 Real-time exchange rates via ExchangeRate-API
- Interactive CLI interface
- HTTP API endpoints
- Docker containerized
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

## API Testing

### Postman Collection

I've set up a comprehensive Postman collection with all the API endpoints for easy testing. You can import the following requests into Postman:

### 1. API Info

**GET** `https://cedrique13-cli.onrender.com/`

**cURL:**

```bash
curl -X GET https://cedrique13-cli.onrender.com/
```

### 2. Convert Currency

**POST** `https://cedrique13-cli.onrender.com/convert`

**Headers:** `Content-Type: application/json`

**Body:**

```json
{
  "amount": 100,
  "fromCurrency": "USD",
  "toCurrency": "EUR"
}
```

**cURL:**

```bash
curl -X POST https://cedrique13-cli.onrender.com/convert \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "fromCurrency": "USD",
    "toCurrency": "EUR"
  }'
```

### 3. Error Testing

**POST** `https://cedrique13-cli.onrender.com/convert`

**Body:** `{}` (missing parameters)

**cURL:**

```bash
curl -X POST https://cedrique13-cli.onrender.com/convert \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 4. Invalid Currency Test

**POST** `https://cedrique13-cli.onrender.com/convert`

**Body:**

```json
{
  "amount": 100,
  "fromCurrency": "INVALID",
  "toCurrency": "EUR"
}
```

**cURL:**

```bash
curl -X POST https://cedrique13-cli.onrender.com/convert \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "fromCurrency": "INVALID",
    "toCurrency": "EUR"
  }'
```

### 5. Same Currency Test

**POST** `https://cedrique13-cli.onrender.com/convert`

**Body:**

```json
{
  "amount": 100,
  "fromCurrency": "USD",
  "toCurrency": "USD"
}
```

**cURL:**

```bash
curl -X POST https://cedrique13-cli.onrender.com/convert \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "fromCurrency": "USD",
    "toCurrency": "USD"
  }'
```

## Project Structure

```
src/
├── index.js          # CLI application
├── simple-server.js  # HTTP API server
├── api.js           # ExchangeRate-API integration
├── prompts.js       # User interactions
└── utils.js         # Utilities
```

---

**Live Demo**: https://cedrique13-cli.onrender.com/
