#!/usr/bin/env node

const axios = require('axios');

async function testPacketTraversal() {
  console.log('🧪 Testing Packet Traversal Logging');
  console.log('=====================================\n');

  const testSMS = {
    message: "Your HDFC Bank Credit Card ending 1234 has been charged Rs. 1,250.00 at AMAZON on 15/12/2023. Available credit limit: Rs. 45,000.00. Call 1800-123-4567 for disputes.",
    sender: "HDFCBK",
    timestamp: new Date().toISOString(),
    userId: "test-user-123"
  };

  // Generate a unique request ID for this test
  const requestId = Math.random().toString(36).substring(7);
  
  console.log('📤 Sending test SMS to webhook...');
  console.log('URL: http://localhost:3001/api/v1/webhooks/sms');
  
  // Print detailed packet information before sending
  console.log('\n📦 PACKET DETAILS:');
  console.log('═'.repeat(50));
  console.log(`🔵 [${requestId}] 📥 OUTGOING PACKET:`);
  console.log(`   Method: POST`);
  console.log(`   URL: http://localhost:3001/api/v1/webhooks/sms`);
  console.log(`   Request ID: ${requestId}`);
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  
  // Headers
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Packet-Traversal-Test/1.0.0',
    'X-Request-ID': requestId
  };
  console.log(`   Headers:`, JSON.stringify(headers, null, 6));
  
  // Body
  console.log(`   Body:`, JSON.stringify(testSMS, null, 6));
  
  // Calculate packet size
  const packetSize = JSON.stringify(testSMS).length;
  console.log(`   Packet Size: ${packetSize} bytes`);
  console.log('═'.repeat(50));
  
  console.log('\n📤 Transmitting packet...');
  console.log('\n' + '='.repeat(50));
  console.log('🔍 WATCH THE CONSOLE OUTPUT BELOW FOR PACKET TRAVERSAL');
  console.log('='.repeat(50) + '\n');

  try {
    const response = await axios.post('http://localhost:3001/api/v1/webhooks/sms', testSMS, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Packet-Traversal-Test/1.0.0',
        'X-Request-ID': requestId
      },
      timeout: 10000
    });

    console.log('\n' + '='.repeat(50));
    console.log('✅ TEST COMPLETED SUCCESSFULLY');
    console.log('='.repeat(50));
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('\n' + '='.repeat(50));
    console.log('❌ TEST FAILED');
    console.log('='.repeat(50));
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Check if backend is running
async function checkBackendHealth() {
  try {
    const response = await axios.get('http://localhost:3001/health', { timeout: 5000 });
    console.log('✅ Backend is running and healthy');
    return true;
  } catch (error) {
    console.log('❌ Backend is not running or not accessible');
    console.log('Please start the backend server first:');
    console.log('  cd backend && npm run dev');
    return false;
  }
}

async function main() {
  const isBackendRunning = await checkBackendHealth();
  
  if (isBackendRunning) {
    await testPacketTraversal();
  }
}

main().catch(console.error); 