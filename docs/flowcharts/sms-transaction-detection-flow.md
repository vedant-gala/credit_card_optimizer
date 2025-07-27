# SMS Transaction Detection Flow

This flowchart illustrates the complete process of detecting and processing transactions from SMS notifications in the Credit Card Optimizer application.

```mermaid
flowchart TD
    A[SMS received by mobile app] --> B[Parse SMS content]
    B --> C{Match SMS pattern?}
    C -->|No match| D[Ignore SMS]
    C -->|Pattern matched| E[Extract transaction data]
    E --> F[Send to webhook endpoint]
    F --> G[Validate webhook signature]
    G -->|Invalid| H[Reject webhook]
    G -->|Valid| I[Add to SMS processing queue]
    I --> J[Process SMS in background]
    J --> K[Parse transaction details]
    K --> L{Parse successful?}
    L -->|Failed| M[Log parsing error]
    L -->|Success| N[Extract: amount, merchant, date]
    N --> O[Send to ML service for categorization]
    O --> P[Get category prediction]
    P --> Q[Match with user's credit cards]
    Q --> R[Determine optimal card for transaction]
    R --> S[Create transaction record]
    S --> T[Calculate potential rewards]
    T --> U[Store in database]
    U --> V[Send real-time notification]
    V --> W[Update dashboard]
    W --> X[Trigger reward optimization]
    
    style A fill:#e1f5fe
    style X fill:#c8e6c9
    style D fill:#f5f5f5
    style H fill:#ffcdd2
    style M fill:#ffcdd2
```

## Process Details

1. **SMS Reception**: Mobile app receives SMS notification from bank
2. **Pattern Matching**: System matches SMS against predefined bank patterns (HDFC, SBI, ICICI, Axis)
3. **Data Extraction**: Transaction details extracted using regex patterns
4. **Webhook Processing**: SMS data sent to backend via secure webhook
5. **Queue Management**: Transaction added to Redis-based processing queue
6. **Background Processing**: SMS processed asynchronously to avoid blocking
7. **ML Categorization**: Transaction sent to ML service for automatic categorization
8. **Card Optimization**: System determines best credit card for the transaction
9. **Database Storage**: Transaction record created in PostgreSQL
10. **Reward Calculation**: Potential rewards calculated based on card benefits
11. **Real-time Updates**: User notified and dashboard updated immediately
12. **Optimization Trigger**: Reward optimization algorithms triggered

## SMS Patterns Supported

- **HDFC Bank**: `HDFC Bank: Rs.(\d+(?:\.\d{2})?) spent on (\w+) at (.+) on (\d{2}\/\d{2}\/\d{4})`
- **SBI**: `SBI: Rs.(\d+(?:\.\d{2})?) spent on (\w+) at (.+) on (\d{2}\/\d{2}\/\d{4})`
- **ICICI Bank**: `ICICI Bank: Rs.(\d+(?:\.\d{2})?) spent on (\w+) at (.+) on (\d{2}\/\d{2}\/\d{4})`
- **Axis Bank**: `Axis Bank: Rs.(\d+(?:\.\d{2})?) spent on (\w+) at (.+) on (\d{2}\/\d{2}\/\d{4})`

## Extracted Data

- **Amount**: Transaction amount in rupees
- **Merchant**: Store or service provider name
- **Date**: Transaction date and time
- **Card Type**: Credit card used (if identifiable)
- **Transaction Type**: Purchase, withdrawal, etc.

## ML Categorization

- **Food & Dining**: Restaurants, groceries, food delivery
- **Shopping**: Retail stores, online shopping
- **Travel**: Flights, hotels, transportation
- **Entertainment**: Movies, events, streaming services
- **Utilities**: Bills, services, subscriptions
- **Healthcare**: Medical expenses, pharmacies
- **Education**: Courses, books, training
- **Other**: Miscellaneous transactions

## Error Handling

- **Pattern Mismatch**: SMS not recognized as transaction
- **Parsing Errors**: Invalid SMS format or missing data
- **Webhook Failures**: Network issues or invalid signatures
- **Queue Failures**: Redis connection or processing errors
- **ML Service Errors**: Categorization service unavailable
- **Database Errors**: Storage or constraint violations

## Performance Optimizations

- **Asynchronous Processing**: Non-blocking SMS processing
- **Queue Management**: Redis-based job queues
- **Batch Processing**: Multiple SMS processed together
- **Caching**: Frequently used data cached in Redis
- **Connection Pooling**: Database connection optimization

## Integration Points

- **Mobile App**: SMS reading and webhook sending
- **ML Services**: Transaction categorization
- **Database**: Transaction storage and retrieval
- **Redis**: Queue management and caching
- **Notification System**: Real-time user alerts
- **Dashboard**: Live transaction updates 