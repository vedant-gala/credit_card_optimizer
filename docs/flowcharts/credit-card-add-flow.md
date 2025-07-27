# Credit Card Addition Flow

This flowchart illustrates the process of adding a new credit card to the user's account in the Credit Card Optimizer application.

```mermaid
flowchart TD
    A[User navigates to add card] --> B[Fill credit card form]
    B --> C[Enter card details: number, expiry, CVV, name]
    C --> D[Submit card information]
    D --> E{User authenticated?}
    E -->|No| F[Redirect to login]
    E -->|Yes| G[Validate card data]
    G -->|Invalid data| H[Return validation errors]
    G -->|Valid data| I[Encrypt sensitive card data]
    I --> J[Validate card with payment gateway]
    J -->|Invalid card| K[Return card validation error]
    J -->|Valid card| L[Create card record in database]
    L --> M{Card creation successful?}
    M -->|No| N[Return database error]
    M -->|Yes| O[Generate card ID]
    O --> P[Store encrypted card data]
    P --> Q[Associate card with user]
    Q --> R[Update user's card list]
    R --> S[Return success response]
    S --> T[Show card in dashboard]
    T --> U[Enable card for transactions]
    
    style A fill:#e1f5fe
    style U fill:#c8e6c9
    style F fill:#fff3e0
    style H fill:#ffcdd2
    style K fill:#ffcdd2
    style N fill:#ffcdd2
```

## Process Details

1. **Form Access**: User navigates to the credit card addition section
2. **Data Entry**: User fills out card details (number, expiry, CVV, cardholder name)
3. **Authentication Check**: System verifies user is logged in with valid JWT token
4. **Input Validation**: Backend validates card format and required fields
5. **Data Encryption**: Sensitive card information is encrypted before storage
6. **Card Verification**: Card is validated with payment gateway service
7. **Database Storage**: Card record is created in PostgreSQL database
8. **User Association**: Card is linked to the authenticated user
9. **Dashboard Update**: User's card list is updated in real-time
10. **Transaction Enablement**: Card becomes available for transaction processing

## Required Card Information

- **Card Number**: 13-19 digit card number
- **Expiry Date**: MM/YY format
- **CVV**: 3-4 digit security code
- **Cardholder Name**: Name as it appears on card
- **Card Type**: Visa, Mastercard, American Express, Discover

## Security Measures

- **Encryption**: Card data encrypted using AES-256
- **Tokenization**: Sensitive data replaced with secure tokens
- **PCI Compliance**: Adherence to Payment Card Industry standards
- **Access Control**: Only authenticated users can add cards
- **Audit Trail**: All card additions logged for security

## Error Handling

- **Authentication Errors**: Invalid or expired tokens return 401 status
- **Validation Errors**: Invalid card data returns 400 status
- **Card Verification Errors**: Invalid card details return 400 status
- **Database Errors**: Storage failures return 500 status
- **Gateway Errors**: Payment processor issues return 503 status

## Integration Points

- **Payment Gateway**: Real-time card validation
- **Database**: Secure card storage
- **Redis**: Session management
- **Frontend**: Real-time UI updates
- **Notification System**: Card addition confirmations 