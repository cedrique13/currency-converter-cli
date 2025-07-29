# Currency Converter CLI

A feature-rich, interactive command-line currency converter that provides real-time exchange rates using the ExchangeRate-API. Built with Node.js and designed for easy deployment with Docker.

## Features

- 🔄 **Real-time Exchange Rates** - Fetches live exchange rates from ExchangeRate-API
- 💬 **Interactive CLI** - User-friendly prompts with input validation
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
git clone <your-repository-url>
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

```bash
npm start
```

## Usage

### Interactive Mode

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

### Development Mode

For development with auto-restart:

```bash
npm run dev
```

## Docker Deployment

### Build & Test Locally

1. **Build the Docker image:**

```bash
docker build -t <dockerhub-username>/currency-converter-cli:v1 .
```

2. **Test locally:**

```bash
docker run -it --env-file .env <dockerhub-username>/currency-converter-cli:v1
```

3. **Push to Docker Hub:**

```bash
docker login
docker push <dockerhub-username>/currency-converter-cli:v1
```

### Deploy on Lab Servers

#### On Web01 and Web02:

1. **SSH into each server:**

```bash
ssh user@web-01
ssh user@web-02
```

2. **Pull and run the container:**

```bash
# Pull the image
docker pull <dockerhub-username>/currency-converter-cli:v1

# Run the container
docker run -d \
  --name currency-converter-app \
  --restart unless-stopped \
  -e EXCHANGE_API_KEY=your_api_key_here \
  -p 8080:3000 \
  <dockerhub-username>/currency-converter-cli:v1
```

3. **Verify deployment:**

```bash
# Check container status
docker ps

# Check container logs
docker logs currency-converter-app

# Test the application
docker exec -it currency-converter-app node src/index.js
```

#### Load Balancer Configuration (Lb01)

Update `/etc/haproxy/haproxy.cfg`:

```haproxy
frontend currency_frontend
    bind *:80
    default_backend currency_backend

backend currency_backend
    balance roundrobin
    option httpchk GET /health
    server web01 172.20.0.11:8080 check
    server web02 172.20.0.12:8080 check
```

Reload HAProxy:

```bash
docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'
```

### Using Docker Compose

For easier deployment with docker-compose:

1. **Create .env file on server:**

```bash
echo "EXCHANGE_API_KEY=your_actual_api_key_here" > .env
```

2. **Deploy with docker-compose:**

```bash
docker-compose up -d
```

3. **Check status:**

```bash
docker-compose ps
docker-compose logs
```

## Testing Load Balancer

Test that traffic is distributed between servers:

```bash
# Test multiple requests
for i in {1..10}; do
  curl -s http://localhost/health
  echo ""
done
```

Expected: Responses should alternate between Web01 and Web02.

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
│   ├── index.js          # Main application entry point
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

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m "Add new feature"`
4. Push to branch: `git push origin feature/new-feature`
5. Create a Pull Request

---

**Built with ❤️ using Node.js and Docker**
