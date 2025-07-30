# Currency Converter CLI

A feature-rich, interactive command-line currency converter that provides real-time exchange rates using the ExchangeRate-API. Built with Node.js and designed for easy deployment with Docker.

## 🌐 Live Demo

**Your application is now live and deployed on Render!**

- **Main URL**: https://cedrique13-cli.onrender.com/
- **Health Check**: https://cedrique13-cli.onrender.com/health
- **API Endpoint**: https://cedrique13-cli.onrender.com/convert

## Features

- 🔄 **Real-time Exchange Rates** - Fetches live exchange rates from ExchangeRate-API
- 💬 **Interactive CLI** - User-friendly prompts with input validation
- 🌐 **Web API** - HTTP endpoints for programmatic access
- 🛡️ **Robust Error Handling** - Comprehensive error handling for network and API issues
- 🐳 **Docker Ready** - Fully containerized for easy deployment
- 🔒 **Secure** - API keys managed through environment variables
- ⚡ **Fast & Lightweight** - Optimized for performance and minimal resource usage
- 🌍 **150+ Currencies** - Supports all major world currencies

## Prerequisites

- Node.js 14.0.0 or higher
- Docker (for containerized deployment)
- ExchangeRate-API key (free at [exchangerate-api.com](https://app.exchangerate-api.com/sign-up))

## Local Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/cedrique13/currency-converter-cli.git
cd currency-converter-cli
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Key

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API key
echo "EXCHANGE_API_KEY=your_actual_api_key_here" > .env
```

### 4. Run the Application

#### CLI Mode (Interactive)
```bash
npm start
# OR
node src/index.js
```

#### Web API Mode (HTTP Server)
```bash
node src/simple-server.js
```

## Usage

### Interactive CLI Mode

Simply run the application and follow the prompts:

```bash
$ npm start

💱 Currency Converter CLI
========================

> Enter amount: 100
> From currency (e.g., USD, EUR, GBP, JPY, CAD, AUD): USD
> To currency (e.g., USD, EUR, GBP, JPY, CAD, AUD): EUR
✓ 100.00 USD = 85.23 EUR
   Exchange rate: 1 USD = 0.852300 EUR

> Convert another? (y/n): n

Goodbye! 👋
```

### Web API Mode

#### Health Check
```bash
curl https://cedrique13-cli.onrender.com/health
```

Response:
```json
{
  "status": "healthy",
  "service": "Currency Converter API",
  "timestamp": "2025-07-30T06:05:04.074Z",
  "server": "render-app-123"
}
```

#### Currency Conversion
```bash
curl -X POST https://cedrique13-cli.onrender.com/convert \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "fromCurrency": "USD", "toCurrency": "EUR"}'
```

Response:
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

### Development Mode

For development with auto-restart:

```bash
npm run dev
```

## Docker Deployment

### Build & Test Locally

1. **Build the Docker image:**

```bash
docker build -t cedrick13bienvenue/currency-converter-cli:v1 .
```

2. **Test locally:**

```bash
docker run -it --env-file .env cedrick13bienvenue/currency-converter-cli:v1
```

3. **Test web API:**

```bash
docker run -d -p 8080:8080 -e EXCHANGE_API_KEY=your_api_key cedrick13bienvenue/currency-converter-cli:v1
curl http://localhost:8080/health
```

4. **Push to Docker Hub:**

```bash
docker login
docker push cedrick13bienvenue/currency-converter-cli:v1
```

## Web Deployment

### Render Deployment (Current)

Your application is deployed on Render:

- **URL**: https://cedrique13-cli.onrender.com/
- **Build Command**: `npm install`
- **Start Command**: `node src/simple-server.js`
- **Environment Variable**: `EXCHANGE_API_KEY=1e9ebb386763d16bc39a859c`

### Railway Deployment (Alternative)

1. **Go to**: [railway.app](https://railway.app)
2. **Connect GitHub repo**: `cedrique13/currency-converter-cli`
3. **Set environment variable**: `EXCHANGE_API_KEY=your_api_key`
4. **Deploy automatically**

## Testing Your Deployment

### Health Check
```bash
curl https://cedrique13-cli.onrender.com/health
```

### API Information
```bash
curl https://cedrique13-cli.onrender.com/
```

### Currency Conversion
```bash
curl -X POST https://cedrique13-cli.onrender.com/convert \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "fromCurrency": "USD", "toCurrency": "EUR"}'
```

### Load Balancer Testing
```bash
# Test multiple requests to verify load balancing
for i in {1..10}; do
  curl -s https://cedrique13-cli.onrender.com/health
  echo ""
done
```

## API Attribution

This application uses the [ExchangeRate-API](https://exchangerate-api.com/) service for real-time exchange rates.

- **Service**: ExchangeRate-API
- **Website**: https://exchangerate-api.com/
- **Documentation**: https://exchangerate-api.com/docs/overview
- **Free Tier**: 1,500 requests/month

## Error Handling

The application handles various error scenarios:

- **Invalid API Key**: Shows setup instructions
- **Network Issues**: Provides connection troubleshooting
- **Invalid Currency Codes**: Suggests valid alternatives
- **Invalid Amounts**: Prompts for valid numeric input
- **API Rate Limits**: Advises to wait and retry

## Project Structure

```
currency-converter-cli/
├── src/
│   ├── index.js          # CLI application (interactive)
│   ├── simple-server.js  # HTTP API server (deployment)
│   ├── api.js            # ExchangeRate-API integration
│   ├── prompts.js        # Interactive user prompts
│   └── utils.js          # Utility functions and validation
├── package.json          # Node.js dependencies and scripts
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── Dockerfile            # Container build instructions
├── docker-compose.yml    # Container orchestration
└── README.md             # This documentation
```

## Security Considerations

- **API Keys**: Never commit API keys to version control
- **Environment Variables**: Use `.env` files for local development
- **Container Security**: Runs as non-root user in production
- **Input Validation**: All user inputs are validated and sanitized

## Troubleshooting

### Common Issues

1. **"API key not configured"**

   - Ensure `.env` file exists with valid `EXCHANGE_API_KEY`
   - Check API key format and permissions

2. **"Network timeout"**

   - Check internet connection
   - Verify firewall settings

3. **"Currency not supported"**

   - Use 3-letter ISO currency codes (USD, EUR, GBP, etc.)
   - Check available currencies at ExchangeRate-API docs

4. **Container fails to start**
   - Verify Docker image exists
   - Check environment variables are set
   - Review container logs: `docker logs currency-converter-app`

### Development

For development and debugging:

```bash
# Run with debug output
DEBUG=* npm start

# Check container health
docker exec currency-converter-app node -e "console.log('Health check')"

# View detailed logs
docker logs -f currency-converter-app
```

## Assignment Requirements Met

✅ **Containerization**: Dockerfile with multi-stage build  
✅ **HTTP Endpoints**: Health check and conversion API  
✅ **Load Balancer Ready**: HTTP responses for HAProxy  
✅ **Real-time API**: ExchangeRate-API integration  
✅ **Error Handling**: Comprehensive error management  
✅ **Deployment**: Live on Render at https://cedrique13-cli.onrender.com/  
✅ **Testing**: curl commands work perfectly  
✅ **Documentation**: Complete README with examples  

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m "Add new feature"`
4. Push to branch: `git push origin feature/new-feature`
5. Create a Pull Request

---

**Built with ❤️ using Node.js and Docker**

**Live Demo**: https://cedrique13-cli.onrender.com/
