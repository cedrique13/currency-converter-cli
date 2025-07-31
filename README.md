# Currency Converter CLI

A Node.js currency converter application that provides real-time exchange rates through an intuitive CLI interface and RESTful HTTP API. This application serves a practical purpose by helping users convert currencies with up-to-date rates from the ExchangeRate-API.

## 🌐 Live Demo

- **API**: https://cedrique13-cli.onrender.com
- **Demo Video**: https://youtu.be/5E4B7GVYwSg

## Features

- 💱 **Real-time exchange rates** via ExchangeRate-API
- 🖥️ **Interactive CLI interface** for direct currency conversion
- 🌐 **HTTP API endpoints** for programmatic access
- 🐳 **Docker containerized** for easy deployment
- 🛡️ **Comprehensive error handling** for API failures and invalid inputs
- 📊 **Clear data presentation** with formatted results

## API Integration

### ExchangeRate-API

This application integrates with the [ExchangeRate-API](https://exchangerate-api.com/) to provide real-time currency conversion rates. The API offers:

- Real-time exchange rates for 170+ currencies
- Reliable and accurate data
- RESTful API with JSON responses
- Free tier with generous limits

**API Documentation**: https://exchangerate-api.com/docs/

## Quick Start

### Local Setup

```bash
# Clone the repository
git clone https://github.com/cedrique13/currency-converter-cli.git
cd currency-converter-cli

# Install dependencies
npm install

# Configure API key
echo "EXCHANGE_API_KEY=your_api_key_here" > .env

# Run CLI mode (interactive)
npm start

# Run API mode (HTTP server)
node src/simple-server.js
```

### Docker Deployment

#### Build Instructions

```bash
# Build the Docker image
docker build -t cedrick13bienvenue/currency-converter-cli:v1 .

# Test locally
docker run -p 8080:8080 -e EXCHANGE_API_KEY=your_api_key cedrick13bienvenue/currency-converter-cli:v1

# Verify it works
curl http://localhost:8080/
```

#### Docker Hub Image Details

- **Repository**: https://hub.docker.com/r/cedrick13bienvenue/currency-converter-cli
- **Image Name**: `cedrick13bienvenue/currency-converter-cli`
- **Available Tags**: `v1`, `v1.1`, `latest`

#### Pull and Run from Docker Hub

```bash
# Login to Docker Hub
docker login

# Pull the image
docker pull cedrick13bienvenue/currency-converter-cli:v1

# Run the container
docker run -d --name currency-app --restart unless-stopped \
  -p 8080:8080 \
  -e EXCHANGE_API_KEY=your_api_key \
  cedrick13bienvenue/currency-converter-cli:v1
```

## API Testing

### Postman Collection

I've set up a comprehensive Postman collection with all the API endpoints for easy testing. You can import the following requests into Postman:

### 1. API Info

**GET** `http://localhost:8080/`

**cURL:**

```bash
curl -X GET http://localhost:8080/
```

**Expected Response:**

```json
{
  "message": "Currency Converter API",
  "endpoints": {
    "convert": "/convert (POST)"
  },
  "usage": "Send POST request to /convert with amount, fromCurrency, toCurrency"
}
```

### 2. Convert Currency

**POST** `http://localhost:8080/convert`

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
curl -X POST http://localhost:8080/convert \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "fromCurrency": "USD",
    "toCurrency": "EUR"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "result": 86.56,
  "rate": 0.8656,
  "fromCurrency": "USD",
  "toCurrency": "EUR",
  "message": "100 USD = 86.56 EUR"
}
```

### 3. Error Testing

**POST** `http://localhost:8080/convert`

**Body:** `{}` (missing parameters)

**cURL:**

```bash
curl -X POST http://localhost:8080/convert \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**

```json
{
  "success": false,
  "error": "Missing required parameters: amount, fromCurrency, toCurrency"
}
```

### 4. Invalid Currency Test

**POST** `http://localhost:8080/convert`

**Body:**

```json
{
  "amount": 100,
  "fromCurrency": "INVALID",
  "toCurrency": "EUR"
}
```

**Expected Response:**

```json
{
  "success": false,
  "error": "Currency code not supported. Try: USD, EUR, GBP, JPY, etc."
}
```

### 5. Same Currency Test

**POST** `http://localhost:8080/convert`

**Body:**

```json
{
  "amount": 100,
  "fromCurrency": "USD",
  "toCurrency": "USD"
}
```

**Expected Response:**

```json
{
  "success": true,
  "result": 100,
  "rate": 1,
  "fromCurrency": "USD",
  "toCurrency": "USD",
  "message": "100 USD = 100.00 USD"
}
```

## Error Handling

The application implements comprehensive error handling for various scenarios:

### API Errors

- **Invalid API Key**: Clear error message with configuration instructions
- **API Timeout**: Network timeout handling with retry suggestions
- **Rate Limiting**: Proper handling of API quota limits
- **Invalid Currency Codes**: User-friendly suggestions for valid currencies

### Input Validation

- **Missing Parameters**: Detailed error messages for required fields
- **Invalid Data Types**: Type checking for amount and currency codes
- **Malformed JSON**: Proper parsing error handling

### Network Issues

- **Connection Failures**: Graceful handling of network problems
- **Service Unavailable**: Clear messaging for external API issues

## User Interaction Features

### CLI Interface

- **Interactive Prompts**: Step-by-step currency conversion
- **Input Validation**: Real-time validation of user inputs
- **Clear Results**: Formatted output with conversion details
- **Error Recovery**: Graceful handling of invalid inputs

### API Interface

- **RESTful Design**: Standard HTTP methods and status codes
- **JSON Responses**: Consistent response format
- **Error Codes**: Appropriate HTTP status codes for different errors
- **CORS Support**: Cross-origin request handling

## Project Structure

```
src/
├── index.js          # CLI application entry point
├── simple-server.js  # HTTP API server
├── api.js           # ExchangeRate-API integration
├── prompts.js       # User interaction logic
└── utils.js         # Utility functions

Docker/
├── Dockerfile       # Multi-stage production build
├── docker-compose.yml # Container orchestration
└── .dockerignore    # Build optimization
```

## Security Considerations

### API Key Management

- **Environment Variables**: API keys stored in `.env` files (not in code)
- **Docker Secrets**: Support for Docker secrets in production
- **No Hardcoding**: No sensitive data in source code or images

### Input Validation

- **Currency Code Validation**: Strict validation of 3-letter currency codes
- **Amount Validation**: Numeric validation with proper error messages
- **JSON Parsing**: Safe JSON parsing with error handling

## Development Challenges & Solutions

### Challenge 1: API Rate Limiting

**Problem**: ExchangeRate-API has rate limits that could affect user experience.
**Solution**: Implemented comprehensive error handling with user-friendly messages and retry suggestions.

### Challenge 2: Docker Multi-Stage Builds

**Problem**: Initial Docker images were too large and included unnecessary dependencies.
**Solution**: Implemented multi-stage builds with Alpine Linux, reducing image size from 280MB to 192MB.

### Challenge 3: Error Handling

**Problem**: Initial implementation lacked comprehensive error handling.
**Solution**: Added robust error handling for network issues, API failures, and invalid inputs with clear user feedback.

## Credits & Attribution

### APIs Used

- **[ExchangeRate-API](https://exchangerate-api.com/)**: Real-time currency exchange rates
  - **Documentation**: https://exchangerate-api.com/docs/
  - **Terms of Service**: https://exchangerate-api.com/terms
  - **API Key**: Free tier available with registration

### Libraries & Dependencies

- **Express.js**: Web framework for HTTP API
- **Axios**: HTTP client for API requests
- **Readline-sync**: CLI interaction library
- **Dotenv**: Environment variable management
- **Nodemon**: Development server with auto-reload

### Development Tools

- **Docker**: Containerization platform
- **Node.js**: JavaScript runtime
- **npm**: Package manager
- **Express.js**: Web framework for HTTP API
- **Axios**: HTTP client for API requests
- **Readline-sync**: CLI interaction library
- **Dotenv**: Environment variable management
- **Nodemon**: Development server with auto-reload

## Testing Instructions

### Local Testing

```bash
# Test CLI mode
npm start

# Test API mode
node src/simple-server.js
curl http://localhost:8080/

# Test Docker
docker run -p 8080:8080 -e EXCHANGE_API_KEY=your_key cedrick13bienvenue/currency-converter-cli:v1
```

### Docker Testing

```bash
# Build and test
docker build -t test-image .
docker run -p 8080:8080 -e EXCHANGE_API_KEY=your_key test-image

# Test from Docker Hub
docker pull cedrick13bienvenue/currency-converter-cli:v1
docker run -p 8080:8080 -e EXCHANGE_API_KEY=your_key cedrick13bienvenue/currency-converter-cli:v1
```

### Load Balancer Setup (Local Simulation)

```bash
# Create network
docker network create currency-net

# Run two app instances
docker run -d --name web01 --restart unless-stopped -p 8080:8080 -e EXCHANGE_API_KEY=your_key cedrick13bienvenue/currency-converter-cli:v1
docker run -d --name web02 --restart unless-stopped -p 8081:8080 -e EXCHANGE_API_KEY=your_key cedrick13bienvenue/currency-converter-cli:v1.1

# Run HAProxy load balancer
docker run -d --name lb-01 -p 80:80 -v $(pwd)/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg haproxy:alpine

# Test load balancer
curl http://localhost:80/
curl -X POST http://localhost:80/convert -H "Content-Type: application/json" -d '{"amount": 100, "fromCurrency": "USD", "toCurrency": "EUR"}'
```

---

**Live Demo**: https://cedrique13-cli.onrender.com/
**Docker Hub**: https://hub.docker.com/r/cedrick13bienvenue/currency-converter-cli
