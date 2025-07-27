# User Signup Flow

This flowchart illustrates the complete user registration process in the Credit Card Optimizer application.

```mermaid
flowchart TD
    A[User enters signup form] --> B[Fill email, password, name]
    B --> C[Submit registration request]
    C --> D{Validate required fields}
    D -->|Missing fields| E[Return validation error]
    D -->|Valid fields| F[Check if user exists]
    F -->|User exists| G[Return "User already exists" error]
    F -->|User doesn't exist| H[Hash password with bcrypt]
    H --> I[Create user in database]
    I --> J{User creation successful?}
    J -->|No| K[Return database error]
    J -->|Yes| L[Generate JWT access token]
    L --> M[Generate refresh token]
    M --> N[Store tokens in Redis]
    N --> O[Return success response with tokens]
    O --> P[User logged in automatically]
    P --> Q[Redirect to dashboard]
    
    style A fill:#e1f5fe
    style Q fill:#c8e6c9
    style E fill:#ffcdd2
    style G fill:#ffcdd2
    style K fill:#ffcdd2
```

## Process Details

1. **Form Submission**: User fills out registration form with email, password, and name
2. **Validation**: Backend validates all required fields are present
3. **Duplicate Check**: System checks if email already exists in database
4. **Password Security**: Password is hashed using bcrypt with configurable salt rounds
5. **User Creation**: New user record is created in PostgreSQL database
6. **Token Generation**: JWT access token and refresh token are generated
7. **Session Storage**: Tokens are stored in Redis for session management
8. **Auto-login**: User is automatically logged in after successful registration
9. **Dashboard Access**: User is redirected to the main dashboard

## Error Handling

- **Validation Errors**: Missing or invalid fields return 400 status
- **Duplicate Email**: Existing email returns 400 status with specific message
- **Database Errors**: Connection or constraint violations return 500 status
- **Token Generation Errors**: JWT creation failures return 500 status

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Refresh token rotation
- Session management with Redis
- Input validation and sanitization 