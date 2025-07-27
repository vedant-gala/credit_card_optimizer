# Credit Card Optimizer - Flowcharts

This directory contains detailed flowcharts for the key processes in the Credit Card Optimizer application. These flowcharts help developers and stakeholders understand the system's workflow and data flow.

## Available Flowcharts

### 1. [User Signup Flow](./user-signup-flow.md)
**Description**: Complete user registration process from form submission to dashboard access.

**Key Features**:
- Form validation and error handling
- Password hashing with bcrypt
- JWT token generation and management
- Database user creation
- Automatic login after registration

**Use Cases**:
- New user onboarding
- Authentication system understanding
- Security implementation review

### 2. [Credit Card Addition Flow](./credit-card-add-flow.md)
**Description**: Process of adding a new credit card to a user's account.

**Key Features**:
- Card data validation and encryption
- Payment gateway integration
- PCI compliance measures
- User-card association
- Real-time dashboard updates

**Use Cases**:
- Card management features
- Security compliance review
- Payment integration testing

### 3. [SMS Transaction Detection Flow](./sms-transaction-detection-flow.md)
**Description**: End-to-end process of detecting and processing transactions from SMS notifications.

**Key Features**:
- SMS pattern matching for multiple banks
- Background queue processing
- ML-powered transaction categorization
- Real-time notifications
- Reward optimization triggers

**Use Cases**:
- Transaction processing pipeline
- SMS parsing implementation
- ML service integration
- Real-time system behavior

### 4. [User Authentication Flow](./user-authentication-flow.md)
**Description**: Complete user authentication process including login, token management, and session handling.

**Key Features**:
- JWT token generation and refresh
- Password hashing with bcrypt
- Session management with Redis
- Token blacklisting and security
- Profile management and access control

**Use Cases**:
- Authentication system implementation
- Security review and compliance
- Session management optimization
- Token lifecycle management

### 5. [Reward Calculation & Optimization Flow](./reward-calculation-flow.md)
**Description**: Process of calculating and optimizing credit card rewards based on transaction data.

**Key Features**:
- Multi-card reward optimization
- Real-time reward calculation
- ML-powered categorization
- Batch processing and reporting
- Personalized reward strategies

**Use Cases**:
- Reward system implementation
- Optimization algorithm development
- Performance analysis and tuning
- Business logic validation

### 6. [ML Recommendation Engine Flow](./ml-recommendation-engine-flow.md)
**Description**: Machine learning recommendation engine for credit card optimization.

**Key Features**:
- Spending pattern analysis
- Personalized card recommendations
- A/B testing framework
- Continuous learning and model updates
- Feature engineering and model training

**Use Cases**:
- ML system architecture
- Recommendation algorithm development
- Model training and deployment
- Performance optimization and monitoring

### 7. [Auto-Card Creation Flow](./auto-card-creation-flow.md)
**Description**: Automatic credit card detection and creation from SMS transaction data.

**Key Features**:
- SMS-based card detection
- Partial card data extraction
- User completion workflow
- Transaction association
- Reward recalculation

**Use Cases**:
- SMS parsing enhancement
- User experience improvement
- Card portfolio automation
- Transaction processing optimization

## How to Use These Flowcharts

### For Developers
1. **Understanding System Flow**: Use these flowcharts to understand how different components interact
2. **Debugging**: Reference flowcharts when troubleshooting issues in specific processes
3. **Feature Development**: Use as a guide when implementing new features or modifying existing ones
4. **Code Review**: Validate that implementation matches the intended flow

### For Stakeholders
1. **System Overview**: Understand the complexity and sophistication of the application
2. **Feature Planning**: Identify potential improvements or new features
3. **Security Review**: Understand security measures in place
4. **Integration Planning**: Plan integrations with external systems

### For Testing
1. **Test Case Design**: Use flowcharts to design comprehensive test scenarios
2. **Integration Testing**: Ensure all integration points are properly tested
3. **Error Scenario Testing**: Test error handling paths identified in flowcharts
4. **Performance Testing**: Identify bottlenecks in the processing flows

## Technical Details

### Flowchart Format
All flowcharts are written in **Mermaid** format, which provides:
- Clear visual representation of processes
- Easy maintenance and updates
- Version control friendly
- Multiple rendering options

### Rendering Options
- **GitHub**: Native Mermaid support in markdown
- **VS Code**: Mermaid extension for live preview
- **Online**: Mermaid Live Editor for editing
- **Documentation**: Can be embedded in documentation systems

### Maintenance
- Update flowcharts when processes change
- Keep flowcharts synchronized with code implementation
- Review flowcharts during code reviews
- Use flowcharts for onboarding new team members

## Related Documentation

- [Architecture Overview](../ARCHITECTURE.md) - High-level system architecture
- [API Documentation](../backend/docs/api.md) - Detailed API specifications
- [Database Schema](../backend/docs/DATABASE_SCHEMA.md) - Database structure
- [Deployment Guide](../backend/docs/DEPLOYMENT.md) - Deployment procedures

## Contributing

When updating these flowcharts:
1. Ensure accuracy with current implementation
2. Update related documentation
3. Test the flow with actual system behavior
4. Get review from team members familiar with the process
5. Update this index file if adding new flowcharts 