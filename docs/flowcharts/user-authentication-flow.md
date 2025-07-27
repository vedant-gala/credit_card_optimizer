# User Authentication Flow

This flowchart illustrates the complete user authentication process in the Credit Card Optimizer application, including login, token management, and session handling.

```mermaid
flowchart TD
    A[User enters login credentials] --> B[Submit email and password]
    B --> C{Validate input fields}
    C -->|Missing fields| D[Return validation error]
    C -->|Valid input| E[Find user by email]
    E --> F{User exists?}
    F -->|No user| G[Return "Invalid credentials" error]
    F -->|User found| H[Verify password with bcrypt]
    H --> I{Password valid?}
    I -->|Invalid password| J[Return "Invalid credentials" error]
    I -->|Valid password| K[Generate JWT access token]
    K --> L[Generate refresh token]
    L --> M[Store tokens in Redis]
    M --> N[Return tokens and user data]
    N --> O[User logged in successfully]
    O --> P[Access protected resources]
    
    %% Token Refresh Flow
    Q[Token expires] --> R[Client sends refresh token]
    R --> S{Validate refresh token}
    S -->|Invalid token| T[Return 401 error]
    S -->|Valid token| U[Find user by token payload]
    U --> V{User exists?}
    V -->|No user| W[Return "User not found" error]
    V -->|User found| X[Generate new access token]
    X --> Y[Generate new refresh token]
    Y --> Z[Update tokens in Redis]
    Z --> AA[Return new tokens]
    AA --> BB[Continue with new tokens]
    
    %% Logout Flow
    CC[User requests logout] --> DD[Send logout request with token]
    DD --> EE{Validate access token}
    EE -->|Invalid token| FF[Return 401 error]
    EE -->|Valid token| GG[Blacklist token in Redis]
    GG --> HH[Clear client-side tokens]
    HH --> II[User logged out successfully]
    
    %% Profile Management
    JJ[User requests profile] --> KK[Send request with access token]
    KK --> LL{Validate access token}
    LL -->|Invalid token| MM[Return 401 error]
    LL -->|Valid token| NN[Extract user ID from token]
    NN --> OO[Fetch user data from database]
    OO --> PP[Return user profile data]
    
    style A fill:#e1f5fe
    style O fill:#c8e6c9
    style BB fill:#c8e6c9
    style II fill:#c8e6c9
    style PP fill:#c8e6c9
    style D fill:#ffcdd2
    style G fill:#ffcdd2
    style J fill:#ffcdd2
    style T fill:#ffcdd2
    style W fill:#ffcdd2
    style FF fill:#ffcdd2
    style MM fill:#ffcdd2
```

## Process Details

### 1. Login Process
1. **Credential Submission**: User provides email and password
2. **Input Validation**: Backend validates required fields are present
3. **User Lookup**: System searches for user by email address
4. **Password Verification**: Password hash compared using bcrypt
5. **Token Generation**: JWT access token and refresh token created
6. **Session Storage**: Tokens stored in Redis for session management
7. **Response**: User data and tokens returned to client

### 2. Token Refresh Process
1. **Token Expiry**: Access token expires (typically 7 days)
2. **Refresh Request**: Client sends refresh token to server
3. **Token Validation**: Refresh token verified for authenticity
4. **User Verification**: User existence confirmed from token payload
5. **New Token Generation**: Fresh access and refresh tokens created
6. **Session Update**: New tokens stored, old ones invalidated
7. **Response**: New tokens returned to client

### 3. Logout Process
1. **Logout Request**: User initiates logout with valid token
2. **Token Validation**: Access token verified for authenticity
3. **Token Blacklisting**: Token added to Redis blacklist
4. **Client Cleanup**: Client-side tokens cleared
5. **Session Termination**: User session effectively ended

### 4. Profile Management
1. **Profile Request**: User requests profile data with token
2. **Token Validation**: Access token verified for authenticity
3. **User Extraction**: User ID extracted from token payload
4. **Data Retrieval**: User profile fetched from database
5. **Response**: Profile data returned to client

## Security Features

### Token Management
- **JWT Access Tokens**: Short-lived (7 days) for API access
- **Refresh Tokens**: Long-lived (30 days) for token renewal
- **Token Rotation**: New refresh tokens generated on each refresh
- **Token Blacklisting**: Invalidated tokens stored in Redis

### Password Security
- **bcrypt Hashing**: Passwords hashed with configurable salt rounds
- **Secure Comparison**: Timing-safe password verification
- **No Plain Text**: Passwords never stored or transmitted in plain text

### Session Security
- **Redis Storage**: Tokens stored in secure Redis instance
- **Automatic Expiry**: Tokens automatically expire based on configuration
- **Cross-Service**: Session data available across all services

## Error Handling

### Authentication Errors
- **Invalid Credentials**: Generic error message for security
- **Missing Fields**: Specific validation error messages
- **Token Expiry**: Clear indication when tokens need refresh
- **User Not Found**: Handled gracefully during token refresh

### Security Responses
- **401 Unauthorized**: Invalid or missing tokens
- **400 Bad Request**: Invalid input data
- **404 Not Found**: User not found during operations
- **500 Internal Error**: Server-side processing errors

## Integration Points

### Database Integration
- **User Lookup**: PostgreSQL queries for user authentication
- **Profile Data**: User information retrieval and updates
- **Session Tracking**: User activity logging and monitoring

### Redis Integration
- **Token Storage**: Secure token caching and management
- **Session Data**: User session information and preferences
- **Rate Limiting**: Authentication attempt rate limiting

### External Services
- **Email Service**: Password reset and verification emails
- **SMS Service**: Two-factor authentication (future enhancement)
- **Logging Service**: Security event logging and monitoring

## Performance Considerations

### Caching Strategy
- **Token Caching**: Frequently accessed tokens cached in Redis
- **User Data Caching**: Profile data cached to reduce database load
- **Session Persistence**: Session data persisted across service restarts

### Optimization Techniques
- **Connection Pooling**: Database connections pooled for efficiency
- **Async Processing**: Non-blocking authentication operations
- **Batch Operations**: Multiple authentication checks batched when possible 