#!/usr/bin/env ts-node

import { faker } from '@faker-js/faker';

interface BankConfig {
  name: string;
  sender: string;
  pattern: string;
  example: string;
}

class SMSTester {
  private readonly banks: BankConfig[] = [
    {
      name: 'HDFC Bank',
      sender: 'HDFCBK',
      pattern: 'HDFC Bank: Rs.{amount} spent on {cardType} card ending {last4} at {merchant} on {date}',
      example: 'HDFC Bank: Rs.1500.00 spent on VISA card ending 1234 at AMAZON on 15/12/2024'
    },
    {
      name: 'SBI',
      sender: 'SBIINB',
      pattern: 'SBI: Rs.{amount} spent on {cardType} ending {last4} at {merchant} on {date}',
      example: 'SBI: Rs.2500.00 spent on MASTERCARD ending 5678 at FLIPKART on 16/12/2024'
    },
    {
      name: 'ICICI Bank',
      sender: 'ICICIB',
      pattern: 'ICICI Bank: Rs.{amount} spent on {cardType} card ending {last4} at {merchant} on {date}',
      example: 'ICICI Bank: Rs.3000.00 spent on VISA card ending 9012 at SWIGGY on 17/12/2024'
    },
    {
      name: 'Axis Bank',
      sender: 'AXISBK',
      pattern: 'Axis Bank: Rs.{amount} spent on {cardType} card ending {last4} at {merchant} on {date}',
      example: 'Axis Bank: Rs.1800.00 spent on MASTERCARD card ending 3456 at ZOMATO on 18/12/2024'
    }
  ];

  private readonly merchants = [
    'AMAZON', 'FLIPKART', 'SWIGGY', 'ZOMATO', 'UBER', 'OLA', 'NETFLIX', 'SPOTIFY',
    'WALMART', 'TARGET', 'COSTCO', 'BEST BUY', 'STARBUCKS', 'MCDONALDS', 'DOMINOS'
  ];

  private readonly cardTypes = ['VISA', 'MASTERCARD', 'AMEX', 'RUPAY'];

  generateSMS(bankName?: string): { message: string; sender: string; timestamp: string } {
    const bank = bankName
      ? this.banks.find(b => b.name.toLowerCase().includes(bankName.toLowerCase()))
      : faker.helpers.arrayElement(this.banks);

    if (!bank) {
      throw new Error(`Bank not found: ${bankName}`);
    }

    const amount = faker.number.float({ min: 100, max: 10000, precision: 0.01 });
    const cardType = faker.helpers.arrayElement(this.cardTypes);
    const last4 = faker.string.numeric(4);
    const merchant = faker.helpers.arrayElement(this.merchants);
    const date = faker.date.recent({ days: 7 }).toLocaleDateString('en-GB');

    const message = bank.pattern
      .replace('{amount}', amount.toFixed(2))
      .replace('{cardType}', cardType)
      .replace('{last4}', last4)
      .replace('{merchant}', merchant)
      .replace('{date}', date);

    return {
      message,
      sender: bank.sender,
      timestamp: new Date().toISOString()
    };
  }

  testAllBanks(): void {
    console.log('🧪 Testing SMS Generation for All Banks\n');

    this.banks.forEach((bank, index) => {
      console.log(`${index + 1}. ${bank.name} (${bank.sender})`);
      console.log('Pattern:', bank.pattern);
      console.log('Example:', bank.example);
      
      // Generate a test SMS
      const testSMS = this.generateSMS(bank.name);
      console.log('Generated:', testSMS.message);
      console.log('Sender:', testSMS.sender);
      console.log('Timestamp:', testSMS.timestamp);
      console.log('');
    });
  }

  testRandomSMS(count: number = 5): void {
    console.log(`🎲 Generating ${count} Random SMS Messages\n`);

    for (let i = 0; i < count; i++) {
      const sms = this.generateSMS();
      console.log(`${i + 1}. ${sms.message}`);
      console.log(`   From: ${sms.sender}`);
      console.log(`   Time: ${sms.timestamp}`);
      console.log('');
    }
  }

  testDataExtraction(): void {
    console.log('🔍 Testing Data Extraction from SMS\n');

    const testSMS = this.generateSMS('HDFC Bank');
    console.log('Sample SMS:', testSMS.message);

    // Extract data using regex patterns
    const amountMatch = testSMS.message.match(/Rs\.(\d+\.\d+)/);
    const cardTypeMatch = testSMS.message.match(/(VISA|MASTERCARD|AMEX|RUPAY)/);
    const last4Match = testSMS.message.match(/ending (\d{4})/);
    const merchantMatch = testSMS.message.match(/at ([A-Z\s]+) on/);
    const dateMatch = testSMS.message.match(/on (\d{2}\/\d{2}\/\d{4})/);

    console.log('\nExtracted Data:');
    console.log('Amount:', amountMatch ? amountMatch[1] : 'Not found');
    console.log('Card Type:', cardTypeMatch ? cardTypeMatch[1] : 'Not found');
    console.log('Last 4:', last4Match ? last4Match[1] : 'Not found');
    console.log('Merchant:', merchantMatch ? merchantMatch[1].trim() : 'Not found');
    console.log('Date:', dateMatch ? dateMatch[1] : 'Not found');
  }
}

// Run tests
const tester = new SMSTester();

console.log('🚀 SMS Simulator Test Suite\n');
console.log('=' .repeat(50));

tester.testAllBanks();
console.log('=' .repeat(50));

tester.testRandomSMS(3);
console.log('=' .repeat(50));

tester.testDataExtraction();
console.log('=' .repeat(50));

console.log('✅ All tests completed successfully!'); 