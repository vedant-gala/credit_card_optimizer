# SMS Simulator - Quick Start Guide

## 🚀 Get Started in 30 Seconds

### 1. Install Dependencies
```bash
cd tools/sms-simulator
npm install
```

### 2. Test the Simulator
```bash
# Show available SMS patterns
npm run dev patterns

# Run the test suite
npm run test-simulator
```

### 3. Send Your First SMS
```bash
# Send a single random SMS
npm run dev send

# Send SMS from specific bank
npm run dev send -b "HDFC Bank"

# Interactive mode
npm run dev interactive
```

## 📋 Available Commands

### Traditional Webhook Commands
| Command | Description | Example |
|---------|-------------|---------|
| `patterns` | Show SMS patterns | `npm run dev patterns` |
| `send` | Send single SMS | `npm run dev send -b "HDFC Bank"` |
| `batch` | Send multiple SMS | `npm run dev batch -c 5 -d 2000` |
| `interactive` | Interactive mode | `npm run dev interactive` |
| `send-hdfc-demo` | Send demo HDFC SMS | `npm run dev send-hdfc-demo` |

### 🧠 Hybrid LLM Parser Commands
| Command | Description | Example |
|---------|-------------|---------|
| `hybrid-send` | Send single SMS to LLM parser | `npm run dev hybrid-send -b "HDFC Bank"` |
| `hybrid-batch` | Send multiple SMS to LLM parser | `npm run dev hybrid-batch -c 5 -d 3000` |
| `hybrid-hdfc-demo` | Send demo HDFC SMS to LLM parser | `npm run dev hybrid-hdfc-demo` |
| `compare` | Compare webhook vs LLM parser | `npm run dev compare -b "HDFC Bank"` |

## 🧪 Testing Scenarios

### Test Traditional Parsing
```bash
# Send SMS with new card (should trigger auto-card creation)
npm run dev send -b "HDFC Bank"
```

### Test AI-Powered Parsing
```bash
# Send SMS to hybrid LLM parser for advanced parsing
npm run dev hybrid-send -b "HDFC Bank"
```

### Compare Both Parsers
```bash
# Test the same SMS with both parsers and compare results
npm run dev compare -b "HDFC Bank"
```

### Test Existing Card
```bash
# Send multiple SMS with same card pattern
npm run dev batch -c 3 -d 1000
```

### Test Error Handling
```bash
# Use interactive mode to create invalid SMS
npm run dev interactive
```

## 🔧 Configuration

### Change Webhook URL
```bash
npm run dev send -u "http://your-backend:3001/api/v1/webhooks/sms"
```

### Custom Bank Patterns
Edit `src/simulator.ts` to add new banks:
```typescript
{
  name: 'New Bank',
  sender: 'NEWBK',
  pattern: 'New Bank: Rs.{amount} spent on {cardType} ending {last4} at {merchant} on {date}',
  example: 'New Bank: Rs.1000.00 spent on VISA ending 9999 at MERCHANT on 01/01/2024'
}
```

## 📊 Expected Output

### Successful SMS Send
```
📤 Sending SMS to webhook...
URL: http://localhost:3001/api/v1/webhooks/sms
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
❌ Failed to send SMS:
Status: 500
Message: Internal Server Error
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure backend is running on port 3001
   - Check webhook endpoint accessibility

2. **Invalid SMS Format**
   - Verify SMS pattern matches expected format
   - Check for special characters

3. **Rate Limiting**
   - Reduce batch size or increase delay
   - Check backend rate limiting

### Debug Mode
```bash
DEBUG=* npm run dev send
```

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [examples/basic-usage.js](examples/basic-usage.js) for programmatic usage
- Run `npm run test-simulator` to see all features in action

## 🤝 Need Help?

- Check the troubleshooting section above
- Review the full README.md documentation
- Run the test suite to verify functionality
- Use interactive mode for step-by-step testing 