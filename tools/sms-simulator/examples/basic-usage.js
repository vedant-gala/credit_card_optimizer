#!/usr/bin/env node

/**
 * Basic Usage Example for SMS Simulator
 * 
 * This example demonstrates how to use the SMS simulator
 * programmatically without the CLI interface.
 */

const axios = require('axios');

// Sample SMS data structure
const sampleSMS = {
  message: "HDFC Bank: Rs.1500.00 spent on VISA card ending 1234 at AMAZON on 15/12/2024",
  sender: "HDFCBK",
  timestamp: new Date().toISOString()
};

// Function to send SMS to webhook
async function sendSMSToWebhook(smsData, webhookUrl = 'http://localhost:3001/api/webhooks/sms') {
  try {
    console.log('📤 Sending SMS to webhook...');
    console.log('URL:', webhookUrl);
    console.log('Data:', JSON.stringify(smsData, null, 2));

    const response = await axios.post(webhookUrl, smsData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SMS-Simulator-Example/1.0.0'
      },
      timeout: 10000
    });

    console.log('✅ SMS sent successfully!');
    console.log('Response:', response.status, response.statusText);
    
    if (response.data) {
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to send SMS:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data || error.message);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

// Function to generate random SMS data
function generateRandomSMS() {
  const banks = [
    { name: 'HDFC Bank', sender: 'HDFCBK' },
    { name: 'SBI', sender: 'SBIINB' },
    { name: 'ICICI Bank', sender: 'ICICIB' },
    { name: 'Axis Bank', sender: 'AXISBK' }
  ];

  const merchants = ['AMAZON', 'FLIPKART', 'SWIGGY', 'ZOMATO', 'UBER', 'OLA'];
  const cardTypes = ['VISA', 'MASTERCARD', 'AMEX', 'RUPAY'];

  const bank = banks[Math.floor(Math.random() * banks.length)];
  const amount = (Math.random() * 10000 + 100).toFixed(2);
  const cardType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
  const last4 = Math.floor(Math.random() * 9000 + 1000).toString();
  const merchant = merchants[Math.floor(Math.random() * merchants.length)];
  const date = new Date().toLocaleDateString('en-GB');

  const message = `${bank.name}: Rs.${amount} spent on ${cardType} card ending ${last4} at ${merchant} on ${date}`;

  return {
    message,
    sender: bank.sender,
    timestamp: new Date().toISOString()
  };
}

// Main execution
async function main() {
  console.log('🚀 SMS Simulator - Basic Usage Example\n');

  // Example 1: Send a predefined SMS
  console.log('=== Example 1: Send Predefined SMS ===');
  await sendSMSToWebhook(sampleSMS);
  console.log('');

  // Example 2: Send a random SMS
  console.log('=== Example 2: Send Random SMS ===');
  const randomSMS = generateRandomSMS();
  await sendSMSToWebhook(randomSMS);
  console.log('');

  // Example 3: Send multiple SMS with delay
  console.log('=== Example 3: Send Multiple SMS ===');
  for (let i = 0; i < 3; i++) {
    console.log(`Sending SMS ${i + 1}/3...`);
    const sms = generateRandomSMS();
    await sendSMSToWebhook(sms);
    
    if (i < 2) {
      console.log('Waiting 2 seconds before next SMS...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('✅ All examples completed!');
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  sendSMSToWebhook,
  generateRandomSMS
}; 