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
- **🧠 Hybrid LLM Parser Support**: Test with advanced AI-powered SMS parsing
- **Parser Comparison**: Compare traditional webhook vs LLM parser results
- **Packet Printing**: Detailed packet information before transmission
- **Rich Output**: Colored console output with detailed logging and parsed results

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
  -u, --url <url>      Webhook URL (default: http://localhost:3001/api/v1/webhooks/sms)
```

#### Send Multiple SMS (Batch Mode)
```bash
npm run dev batch [options]

Options:
  -c, --count <number>  Number of SMS to send (default: 5)
  -d, --delay <number>  Delay between SMS in milliseconds (default: 1000)
  -u, --url <url>       Webhook URL (default: http://localhost:3001/api/v1/webhooks/sms)
```

#### Interactive Mode
```bash
npm run dev interactive [options]

Options:
  -u, --url <url>      Webhook URL (default: http://localhost:3001/api/v1/webhooks/sms)
```

#### Show Patterns
```bash
npm run dev patterns
```

### Test Packet Printing
```bash
# Test packet traversal with detailed logging
npm run test-traversal

# Demo packet printing functionality
npm run demo-packet

# View packet traversal documentation
cat backend/docs/PACKET_TRAVERSAL_LOGGING.md
```

## 🧠 Hybrid LLM Parser Commands

### Test with AI-Powered SMS Parsing

The simulator now supports the new Hybrid LLM Parser that combines AI (Phi-2 LLM) with traditional regex parsing for maximum accuracy.

#### Send Single SMS to Hybrid Parser
```bash
# Send a random SMS to hybrid parser
npm run dev hybrid-send

# Send specific bank SMS to hybrid parser
npm run dev hybrid-send -b "HDFC Bank"

# Use custom API URL
npm run dev hybrid-send -u "http://localhost:3001/api/v1"
```

#### Send Batch SMS to Hybrid Parser
```bash
# Send 5 SMS to hybrid parser (default 2 second delay for LLM processing)
npm run dev hybrid-batch

# Custom count and delay
npm run dev hybrid-batch -c 10 -d 3000

# Custom API URL
npm run dev hybrid-batch -c 5 -d 2000 -u "http://localhost:3001/api/v1"
```

#### Send Demo HDFC SMS to Hybrid Parser
```bash
# Test the specific HDFC format with hybrid parser
npm run dev hybrid-hdfc-demo

# With custom URL
npm run dev hybrid-hdfc-demo -u "http://localhost:3001/api/v1"
```

#### Compare Parser Results
```bash
# Compare webhook vs hybrid parser for same SMS
npm run dev compare

# With specific bank
npm run dev compare -b "HDFC Bank"

# With custom URLs
npm run dev compare -w "http://localhost:3001/api/v1/webhooks/sms" -h "http://localhost:3001/api/v1"
```

### Hybrid Parser Output Example
```
🧠 Sending SMS to Hybrid LLM Parser...
URL: http://localhost:3001/api/v1/hybrid-sms/parse

📦 PACKET DETAILS:
═══════════════════════════════════════════════════════
🔵 [abc123] 📥 OUTGOING PACKET:
   Method: POST
   URL: http://localhost:3001/api/v1/hybrid-sms/parse
   Request ID: abc123
   Timestamp: 2025-07-30T17:30:00.000Z
   Headers: {...}
   Body: {...}
   Packet Size: 156 bytes
═══════════════════════════════════════════════════════

🧠 Processing with Hybrid Parser (LLM + Regex)...

✅ SMS parsed successfully!
Response: 200 OK

📊 PARSED RESULTS:
═══════════════════════════════════════════════════════
✅ Parsing Status: SUCCESS
🔍 Parser Used: LLM
🎯 Confidence: 0.95

💰 Transaction Details:
   Amount: 799.00
   Currency: INR
   Transaction Type: debit
   Merchant: Payu*Swiggy Food
   Date: 2025-07-30
   Transaction ID: N/A

🏦 Bank Information:
   Bank: HDFC Bank
   Country: India
   Sender IDs: HDFCBK

💳 Card Information:
   Last 4 Digits: 0088
   Type: debit

💵 Balance Information:
   Available: N/A
   Currency: N/A
═══════════════════════════════════════════════════════
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
The default webhook URL is `http://localhost:3001/api/v1/webhooks/sms`. You can change this using the `-u` or `--url` option.

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

### Packet Printing (New Feature!)
```
📤 Sending SMS to webhook...
URL: http://localhost:3001/api/v1/webhooks/sms

📦 PACKET DETAILS:
══════════════════════════════════════════════════════════════
🔵 [abc123] 📥 OUTGOING PACKET:
   Method: POST
   URL: http://localhost:3001/api/v1/webhooks/sms
   Request ID: abc123
   Timestamp: 2023-12-15T10:30:00.000Z
   Headers: {
        "Content-Type": "application/json",
        "User-Agent": "SMS-Simulator/1.0.0",
        "X-Request-ID": "abc123"
      }
   Body: {
        "message": "HDFC Bank: Rs.1500.00 spent on VISA card ending 1234 at AMAZON on 15/12/2024",
        "sender": "HDFCBK",
        "timestamp": "2023-12-15T10:30:00.000Z",
        "userId": "test-user-123"
      }
   Packet Size: 245 bytes
══════════════════════════════════════════════════════════════

📤 Transmitting packet...
```

### Successful SMS Send
```
✅ SMS sent successfully!
Response: 200 OK
Response Data: {
  "success": true,
  "status": "received",
  "message": "SMS received successfully",
  "timestamp": "2023-12-15T10:30:01.000Z"
}
```

### Failed SMS Send
```
📤 Sending SMS to webhook...
URL: http://localhost:3001/api/v1/webhooks/sms
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
The simulator expects the backend to have a webhook endpoint at `/api/v1/webhooks/sms` that accepts POST requests with the following structure:

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