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
credit_card_optimizer/
├── README.md                                    # Project overview and setup guide
├── LICENSE                                      # MIT License
├── .gitignore                                   # Git ignore patterns
├── .gitattributes                               # Git attributes
├── docker-compose.yml                           # Docker services configuration
├── env.example                                  # Environment variables template
│
├── backend/                                     # Node.js + Express API Server
│   ├── package.json                             # Backend dependencies and scripts
│   ├── tsconfig.json                            # TypeScript configuration
│   ├── Dockerfile                               # Backend container configuration
│   ├── src/
│   │   ├── app.ts                               # Express application setup
│   │   ├── server.ts                            # Server entry point
│   │   ├── config/
│   │   │   ├── database.ts                      # PostgreSQL connection config
│   │   │   ├── redis.ts                         # Redis connection config
│   │   │   └── constants.ts                     # Application constants
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts               # Authentication endpoints
│   │   │   ├── transaction.controller.ts        # Transaction management
│   │   │   ├── creditCard.controller.ts         # Credit card management
│   │   │   ├── rewards.controller.ts            # Rewards calculation
│   │   │   ├── dashboard.controller.ts          # Dashboard data
│   │   │   └── recommendation.controller.ts     # ML recommendations
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts               # JWT authentication
│   │   │   ├── validation.middleware.ts         # Input validation
│   │   │   ├── rateLimit.middleware.ts          # Rate limiting
│   │   │   └── error.middleware.ts              # Error handling
│   │   ├── models/
│   │   │   ├── index.ts                         # Model exports
│   │   │   ├── User.ts                          # User data model
│   │   │   ├── CreditCard.ts                    # Credit card model
│   │   │   ├── Transaction.ts                   # Transaction model
│   │   │   ├── Reward.ts                        # Reward model
│   │   │   └── RewardCategory.ts                # Reward categories
│   │   ├── routes/
│   │   │   ├── index.ts                         # Route aggregator
│   │   │   ├── auth.routes.ts                   # Authentication routes
│   │   │   ├── transactions.routes.ts           # Transaction routes
│   │   │   ├── creditCards.routes.ts            # Credit card routes
│   │   │   ├── rewards.routes.ts                # Rewards routes
│   │   │   └── webhooks.routes.ts               # Webhook endpoints
│   │   ├── services/
│   │   │   ├── auth.service.ts                  # Authentication logic
│   │   │   ├── transaction.service.ts           # Transaction processing
│   │   │   ├── sms-parser.service.ts            # SMS parsing logic
│   │   │   ├── rewards.service.ts               # Rewards calculation
│   │   │   ├── recommendation.service.ts        # ML recommendations
│   │   │   ├── notification.service.ts          # Push notifications
│   │   │   └── payment-gateway.service.ts       # Payment integration
│   │   ├── utils/
│   │   │   ├── logger.ts                        # Winston logging
│   │   │   ├── validation.ts                    # Input validation utilities
│   │   │   ├── encryption.ts                    # Encryption utilities
│   │   │   ├── date.utils.ts                    # Date manipulation
│   │   │   └── response.utils.ts                # Response formatting
│   │   ├── jobs/                                # Background job processing
│   │   │   ├── queue.ts                         # Bull queue setup
│   │   │   ├── sms-processing.job.ts            # SMS processing jobs
│   │   │   ├── reward-calculation.job.ts        # Reward calculation jobs
│   │   │   └── notification.job.ts              # Notification jobs
│   │   ├── database/
│   │   │   ├── migrations/                      # Database schema migrations
│   │   │   │   ├── 001_create_users.ts
│   │   │   │   ├── 002_create_credit_cards.ts
│   │   │   │   ├── 003_create_transactions.ts
│   │   │   │   └── 004_create_rewards.ts
│   │   │   ├── seeds/                           # Database seeding
│   │   │   │   ├── credit-cards.seed.ts
│   │   │   │   └── reward-categories.seed.ts
│   │   │   └── connection.ts                    # Database connection
│   │   └── types/
│   │       ├── index.ts                         # Type exports
│   │       ├── user.types.ts                    # User type definitions
│   │       ├── transaction.types.ts             # Transaction types
│   │       └── reward.types.ts                  # Reward types
│   ├── tests/                                   # Test suite
│   │   ├── unit/                                # Unit tests
│   │   │   ├── services/                        # Service tests
│   │   │   └── controllers/                     # Controller tests
│   │   ├── integration/                         # Integration tests
│   │   └── fixtures/                            # Test data
│   └── docs/                                    # Backend documentation
│       ├── api.md                               # API documentation
│       └── swagger.json                         # OpenAPI specification
│
├── mobile-app/                                  # React Native Mobile Application
│   ├── package.json                             # Mobile app dependencies
│   ├── metro.config.js                          # Metro bundler config
│   ├── react-native.config.js                   # React Native config
│   ├── android/                                 # Android-specific files
│   ├── ios/                                     # iOS-specific files
│   ├── src/
│   │   ├── App.tsx                              # Main app component
│   │   ├── components/
│   │   │   ├── common/                          # Reusable UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Loading.tsx
│   │   │   ├── forms/                           # Form components
│   │   │   │   ├── TransactionForm.tsx
│   │   │   │   └── CreditCardForm.tsx
│   │   │   └── charts/                          # Chart components
│   │   │       ├── SpendingChart.tsx
│   │   │       └── RewardsChart.tsx
│   │   ├── screens/
│   │   │   ├── auth/                            # Authentication screens
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── RegisterScreen.tsx
│   │   │   ├── dashboard/                       # Dashboard screens
│   │   │   │   ├── DashboardScreen.tsx
│   │   │   │   └── RewardsOverview.tsx
│   │   │   ├── transactions/                    # Transaction screens
│   │   │   │   ├── TransactionList.tsx
│   │   │   │   ├── TransactionDetail.tsx
│   │   │   │   └── AddTransaction.tsx
│   │   │   ├── cards/                           # Credit card screens
│   │   │   │   ├── CardList.tsx
│   │   │   │   └── CardDetail.tsx
│   │   │   └── recommendations/                 # Recommendation screens
│   │   │       └── RecommendationScreen.tsx
│   │   ├── navigation/                          # Navigation configuration
│   │   │   ├── AppNavigator.tsx
│   │   │   ├── AuthNavigator.tsx
│   │   │   └── TabNavigator.tsx
│   │   ├── services/                            # API and external services
│   │   │   ├── api.ts                           # API client configuration
│   │   │   ├── auth.service.ts                  # Authentication service
│   │   │   ├── transaction.service.ts           # Transaction service
│   │   │   ├── sms.service.ts                   # SMS reading permissions
│   │   │   └── storage.service.ts               # Local storage
│   │   ├── store/                               # State management (Redux/Context)
│   │   │   ├── index.ts                         # Store configuration
│   │   │   ├── auth/                            # Authentication state
│   │   │   ├── transactions/                    # Transaction state
│   │   │   └── rewards/                         # Rewards state
│   │   ├── utils/                               # Utility functions
│   │   │   ├── constants.ts                     # App constants
│   │   │   ├── helpers.ts                       # Helper functions
│   │   │   └── validation.ts                    # Form validation
│   │   ├── hooks/                               # Custom React hooks
│   │   │   ├── useAuth.ts                       # Authentication hook
│   │   │   ├── useTransactions.ts               # Transaction hook
│   │   │   └── useRewards.ts                    # Rewards hook
│   │   └── types/                               # TypeScript type definitions
│   │       ├── index.ts                         # Type exports
│   │       ├── navigation.types.ts              # Navigation types
│   │       └── api.types.ts                     # API response types
│   └── __tests__/                               # Test files
│       ├── components/                          # Component tests
│       └── screens/                             # Screen tests
│
├── web-dashboard/                               # Next.js Web Dashboard
│   ├── package.json                             # Web app dependencies
│   ├── next.config.js                           # Next.js configuration
│   ├── tailwind.config.js                       # Tailwind CSS config
│   ├── tsconfig.json                            # TypeScript configuration
│   ├── public/                                  # Static assets
│   │   ├── images/                              # Image assets
│   │   └── icons/                               # Icon assets
│   ├── src/
│   │   ├── pages/                               # Next.js pages
│   │   │   ├── _app.tsx                         # App wrapper
│   │   │   ├── _document.tsx                    # Document wrapper
│   │   │   ├── index.tsx                        # Dashboard home page
│   │   │   ├── login.tsx                        # Login page
│   │   │   ├── transactions/                    # Transaction pages
│   │   │   │   ├── index.tsx                    # Transaction list
│   │   │   │   └── [id].tsx                     # Transaction detail
│   │   │   ├── cards/                           # Credit card pages
│   │   │   │   └── index.tsx                    # Card management
│   │   │   ├── rewards/                         # Rewards pages
│   │   │   │   └── index.tsx                    # Rewards overview
│   │   │   └── api/                             # Next.js API routes
│   │   │       ├── auth/                        # Authentication API
│   │   │       └── proxy/                       # Backend proxy routes
│   │   ├── components/                          # React components
│   │   │   ├── ui/                              # Reusable UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   └── Modal.tsx
│   │   │   ├── layout/                          # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── dashboard/                       # Dashboard components
│   │   │   │   ├── StatsCards.tsx
│   │   │   │   ├── SpendingChart.tsx
│   │   │   │   └── RecentTransactions.tsx
│   │   │   └── forms/                           # Form components
│   │   │       ├── TransactionForm.tsx
│   │   │       └── CreditCardForm.tsx
│   │   ├── lib/                                 # Utility libraries
│   │   │   ├── api.ts                           # API client
│   │   │   ├── auth.ts                          # Authentication utilities
│   │   │   └── utils.ts                         # General utilities
│   │   ├── hooks/                               # Custom React hooks
│   │   │   ├── useAuth.ts                       # Authentication hook
│   │   │   ├── useTransactions.ts               # Transaction hook
│   │   │   └── useApi.ts                        # API hook
│   │   ├── store/                               # State management
│   │   │   └── index.ts                         # Store configuration
│   │   ├── styles/                              # Global styles
│   │   │   └── globals.css                      # Global CSS
│   │   └── types/                               # TypeScript types
│   │       ├── index.ts                         # Type exports
│   │       └── api.types.ts                     # API types
│   └── __tests__/                               # Test files
│       ├── pages/                               # Page tests
│       └── components/                          # Component tests
│
├── shared/                                      # Shared Utilities and Types
│   ├── package.json                             # Shared package dependencies
│   ├── tsconfig.json                            # TypeScript configuration
│   └── src/
│       ├── types/                               # Shared type definitions
│       │   ├── user.types.ts                    # User types
│       │   ├── transaction.types.ts             # Transaction types
│       │   ├── creditCard.types.ts              # Credit card types
│       │   └── api.types.ts                     # API types
│       ├── utils/                               # Shared utilities
│       │   ├── validation.ts                    # Validation functions
│       │   ├── constants.ts                     # Shared constants
│       │   └── helpers.ts                       # Helper functions
│       └── config/                              # Shared configuration
│           └── api-endpoints.ts                 # API endpoint definitions
│
├── ml-services/                                 # Python Machine Learning Services
│   ├── requirements.txt                         # Python dependencies
│   ├── Dockerfile                               # ML services container
│   ├── src/
│   │   ├── main.py                              # FastAPI application entry point
│   │   ├── models/                              # ML models
│   │   │   ├── transaction_categorizer.py       # Transaction categorization
│   │   │   └── recommendation_engine.py         # Card recommendations
│   │   ├── services/                            # ML services
│   │   │   └── prediction.service.py            # Prediction service
│   │   └── utils/                               # ML utilities
│   │       └── data_preprocessing.py            # Data preprocessing
│   └── tests/                                   # ML service tests
│
├── infrastructure/                              # DevOps and Deployment
│   ├── docker/                                  # Docker configurations
│   │   ├── backend.Dockerfile                   # Backend container
│   │   ├── frontend.Dockerfile                  # Frontend container
│   │   └── nginx.conf                           # Nginx reverse proxy config
│   ├── kubernetes/                              # Kubernetes manifests (optional)
│   ├── terraform/                               # Infrastructure as code
│   └── scripts/                                 # Deployment scripts
│       ├── deploy.sh                            # Deployment script
│       ├── migrate.sh                           # Database migration script
│       └── seed.sh                              # Database seeding script
│
├── docs/                                        # Project Documentation
│   ├── API.md                                   # API documentation
│   ├── DEPLOYMENT.md                            # Deployment guide
│   ├── DATABASE_SCHEMA.md                       # Database schema documentation
│   ├── SMS_PARSING.md                           # SMS parsing guide
│   └── ARCHITECTURE.md                          # System architecture overview
│
└── tools/                                       # Development Tools
    ├── sms-simulator/                           # SMS simulation tool
    │   ├── package.json                         # Simulator dependencies
    │   └── src/
    │       └── simulator.ts                     # SMS simulation logic
    └── data-migration/                          # Data migration tools
        └── scripts/                             # Migration scripts
```

### 🏗️ Architecture Overview

The project follows a **microservices architecture** with clear separation of concerns:

- **Backend API**: Central Node.js/Express service handling all business logic
- **Mobile App**: React Native for cross-platform mobile experience
- **Web Dashboard**: Next.js for web-based management interface
- **ML Services**: Python FastAPI for AI/ML processing
- **Shared Package**: Common types and utilities across all services
- **Infrastructure**: Docker, Nginx, and deployment automation

### 🔧 Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Backend** | Node.js + Express + TypeScript | RESTful API with authentication |
| **Mobile** | React Native + TypeScript | Cross-platform mobile app |
| **Web** | Next.js + Tailwind CSS | Responsive web dashboard |
| **ML** | Python + FastAPI + scikit-learn | AI/ML processing |
| **Database** | PostgreSQL | Primary data storage |
| **Cache** | Redis | Session storage & job queues |
| **Container** | Docker + Docker Compose | Development & deployment |
| **Proxy** | Nginx | Reverse proxy & load balancing |

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
   cd credit_card_optimizer
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
