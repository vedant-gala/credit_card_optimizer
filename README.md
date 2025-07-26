# Credit Card Rewards Optimizer

A comprehensive platform for optimizing credit card rewards through SMS transaction parsing, intelligent categorization, and personalized recommendations.

## 🚀 Features

- **SMS Transaction Parsing**: Automatically extract transaction data from SMS notifications
- **Smart Categorization**: AI-powered transaction categorization
- **Rewards Optimization**: Maximize rewards across multiple credit cards
- **Real-time Dashboard**: Web and mobile interfaces for transaction monitoring
- **Personalized Recommendations**: ML-driven card recommendations

## 🏗️ Architecture

This is a monorepo containing:
- **Backend**: Node.js + Express API with TypeScript
- **Mobile App**: React Native application
- **Web Dashboard**: Next.js web application
- **ML Services**: Python-based machine learning services
- **Shared**: Common utilities and types

## 📁 Project Structure

```
credit-card-rewards-app/
├── backend/          # Node.js API server
├── mobile-app/       # React Native mobile app
├── web-dashboard/    # Next.js web dashboard
├── shared/           # Shared utilities and types
├── ml-services/      # Python ML services
├── infrastructure/   # DevOps and deployment
├── docs/            # Project documentation
└── tools/           # Development tools
```

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Docker & Docker Compose
- React Native development environment

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd credit-card-rewards-app
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

3. **Start development servers:**
   ```bash
   # Start backend
   cd backend && npm run dev
   
   # Start web dashboard
   cd web-dashboard && npm run dev
   
   # Start mobile app
   cd mobile-app && npm start
   ```

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [SMS Parsing Guide](./docs/SMS_PARSING.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
