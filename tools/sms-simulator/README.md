# SMS Simulator Tool

A comprehensive tool for simulating SMS messages to test transaction parsing and auto-card creation features in the Credit Card Optimizer system.

## 🎯 Purpose

This tool helps developers and testers simulate real-world SMS messages from various banks to test:
- SMS transaction parsing functionality
- Auto-card creation from SMS data
- Webhook endpoint validation
- Transaction categorization
- Reward calculation workflows

## 🚀 Features

- **Multiple Bank Support**: Simulate SMS from HDFC Bank, SBI, ICICI Bank, and Axis Bank
- **Realistic Patterns**: Uses actual SMS patterns from Indian banks
- **Interactive Mode**: Step-by-step SMS creation with customization
- **Batch Mode**: Send multiple SMS messages with configurable delays
- **Customizable Content**: Modify amount, card type, merchant, and card details
- **Webhook Integration**: Direct integration with backend webhook endpoints
- **Rich Output**: Colored console output with detailed logging

## 📦 Installation

```bash
cd tools/sms-simulator
npm install
```

## 🛠️ Usage

### Quick Start

```bash
# Send a single random SMS
npm run dev send

# Interactive mode
npm run dev interactive

# Show available patterns
npm run dev patterns
```

### Command Line Options

#### Send Single SMS
```bash
npm run dev send [options]

Options:
  -b, --bank <bank>    Specific bank name (HDFC Bank, SBI, ICICI Bank, Axis Bank)
  -u, --url <url>      Webhook URL (default: http://localhost:3001/api/webhooks/sms)
```

#### Send Multiple SMS (Batch Mode)
```bash
npm run dev batch [options]

Options:
  -c, --count <number>  Number of SMS to send (default: 5)
  -d, --delay <number>  Delay between SMS in milliseconds (default: 1000)
  -u, --url <url>       Webhook URL (default: http://localhost:3001/api/webhooks/sms)
```

#### Interactive Mode
```bash
npm run dev interactive [options]

Options:
  -u, --url <url>      Webhook URL (default: http://localhost:3001/api/webhooks/sms)
```

#### Show Patterns
```bash
npm run dev patterns
```

## 📋 SMS Patterns

The simulator supports the following bank patterns:

### 1. HDFC Bank (HDFCBK)
```
Pattern: HDFC Bank: Rs.{amount} spent on {cardType} card ending {last4} at {merchant} on {date}
Example: HDFC Bank: Rs.1500.00 spent on VISA card ending 1234 at AMAZON on 15/12/2024
```

### 2. SBI (SBIINB)
```
Pattern: SBI: Rs.{amount} spent on {cardType} ending {last4} at {merchant} on {date}
Example: SBI: Rs.2500.00 spent on MASTERCARD ending 5678 at FLIPKART on 16/12/2024
```

### 3. ICICI Bank (ICICIB)
```
Pattern: ICICI Bank: Rs.{amount} spent on {cardType} card ending {last4} at {merchant} on {date}
Example: ICICI Bank: Rs.3000.00 spent on VISA card ending 9012 at SWIGGY on 17/12/2024
```

### 4. Axis Bank (AXISBK)
```
Pattern: Axis Bank: Rs.{amount} spent on {cardType} card ending {last4} at {merchant} on {date}
Example: Axis Bank: Rs.1800.00 spent on MASTERCARD card ending 3456 at ZOMATO on 18/12/2024
```

## 🧪 Testing Scenarios

### 1. Auto-Card Creation Testing
```bash
# Send SMS with new card details
npm run dev send -b "HDFC Bank"
```

**Expected Behavior:**
- Backend should detect new card from SMS
- Auto-create card entry with partial data
- Send notification to user to complete card details

### 2. Existing Card Transaction Testing
```bash
# Send multiple SMS with same card
npm run dev batch -c 3 -d 2000
```

**Expected Behavior:**
- Backend should match existing card
- Process transaction normally
- Update rewards calculation

### 3. Invalid SMS Testing
```bash
# Use interactive mode to create custom SMS
npm run dev interactive
```

**Expected Behavior:**
- Backend should handle parsing errors gracefully
- Log invalid SMS for analysis
- Continue processing other SMS

## 🔧 Configuration

### Webhook URL
The default webhook URL is `http://localhost:3001/api/webhooks/sms`. You can change this using the `-u` or `--url` option.

### Custom Bank Patterns
To add new bank patterns, modify the `banks` array in `src/simulator.ts`:

```typescript
{
  name: 'New Bank',
  sender: 'NEWBK',
  pattern: 'New Bank: Rs.{amount} spent on {cardType} ending {last4} at {merchant} on {date}',
  example: 'New Bank: Rs.1000.00 spent on VISA ending 9999 at MERCHANT on 01/01/2024'
}
```

## 📊 Output Examples

### Successful SMS Send
```
📤 Sending SMS to webhook...
URL: http://localhost:3001/api/webhooks/sms
Data: {
  "message": "HDFC Bank: Rs.1500.00 spent on VISA card ending 1234 at AMAZON on 15/12/2024",
  "sender": "HDFCBK",
  "timestamp": "2024-12-15T10:30:00.000Z"
}
✅ SMS sent successfully!
Response: 200 OK
```

### Failed SMS Send
```
📤 Sending SMS to webhook...
URL: http://localhost:3001/api/webhooks/sms
Data: { ... }
❌ Failed to send SMS:
Status: 500
Message: Internal Server Error
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure backend server is running on port 3001
   - Check if webhook endpoint is accessible

2. **Invalid SMS Format**
   - Verify SMS pattern matches expected format
   - Check for special characters in merchant names

3. **Rate Limiting**
   - Reduce batch size or increase delay between SMS
   - Check backend rate limiting configuration

### Debug Mode
To enable detailed logging, set the `DEBUG` environment variable:

```bash
DEBUG=* npm run dev send
```

## 🔗 Integration

### Backend Webhook Endpoint
The simulator expects the backend to have a webhook endpoint at `/api/webhooks/sms` that accepts POST requests with the following structure:

```json
{
  "message": "SMS content",
  "sender": "Bank sender ID",
  "timestamp": "ISO timestamp",
  "userId": "Optional user ID"
}
```

### Response Format
The backend should respond with appropriate HTTP status codes:
- `200`: SMS processed successfully
- `400`: Invalid SMS format
- `500`: Internal server error

## 📝 Development

### Building
```bash
npm run build
```

### Running Tests
```bash
npm test
```

### Type Checking
```bash
npx tsc --noEmit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add new bank patterns or features
4. Update tests and documentation
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 