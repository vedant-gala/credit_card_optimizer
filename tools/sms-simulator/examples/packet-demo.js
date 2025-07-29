#!/usr/bin/env node

const axios = require('axios');

async function demonstratePacketPrinting() {
  console.log('🎯 SMS Simulator - Packet Printing Demo');
  console.log('========================================\n');

  const demoSMS = {
    message: "Your ICICI Bank Credit Card ending 5678 has been charged Rs. 2,500.00 at FLIPKART on 15/12/2023. Available credit limit: Rs. 35,000.00.",
    sender: "ICICIB",
    timestamp: new Date().toISOString(),
    userId: "demo-user-456"
  };

  const requestId = Math.random().toString(36).substring(7);
  
  console.log('📤 PREPARING TO SEND SMS PACKET');
  console.log('═'.repeat(60));
  
  // Simulate the packet printing that happens in the SMS simulator
  console.log(`🔵 [${requestId}] 📥 OUTGOING PACKET:`);
  console.log(`   Method: POST`);
  console.log(`   URL: http://localhost:3001/api/v1/webhooks/sms`);
  console.log(`   Request ID: ${requestId}`);
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'SMS-Simulator/1.0.0',
    'X-Request-ID': requestId
  };
  console.log(`   Headers:`, JSON.stringify(headers, null, 6));
  
  console.log(`   Body:`, JSON.stringify(demoSMS, null, 6));
  
  const packetSize = JSON.stringify(demoSMS).length;
  console.log(`   Packet Size: ${packetSize} bytes`);
  console.log('═'.repeat(60));
  
  console.log('\n📤 TRANSMITTING PACKET TO BACKEND...');
  console.log('═'.repeat(60));
  console.log('🔍 WATCH FOR BACKEND PACKET TRAVERSAL LOGS BELOW');
  console.log('═'.repeat(60) + '\n');

  try {
    const response = await axios.post('http://localhost:3001/api/v1/webhooks/sms', demoSMS, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SMS-Simulator/1.0.0',
        'X-Request-ID': requestId
      },
      timeout: 10000
    });

    console.log('\n' + '═'.repeat(60));
    console.log('✅ PACKET TRANSMISSION SUCCESSFUL');
    console.log('═'.repeat(60));
    console.log(`Response Status: ${response.status}`);
    console.log(`Response Data:`, JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('\n' + '═'.repeat(60));
    console.log('❌ PACKET TRANSMISSION FAILED');
    console.log('═'.repeat(60));
    
    if (error.response) {
      console.log(`Error Status: ${error.response.status}`);
      console.log(`Error Data:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`Error: ${error.message}`);
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
    await demonstratePacketPrinting();
  }
}

main().catch(console.error); 