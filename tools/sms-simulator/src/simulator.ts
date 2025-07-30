#!/usr/bin/env ts-node

import axios from 'axios';
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { faker } from '@faker-js/faker';

interface SMSData {
  message: string;
  sender: string;
  timestamp: string;
  userId?: string;
}

interface BankConfig {
  name: string;
  sender: string;
  pattern: string;
  example: string;
}

class SMSSimulator {
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
    'WALMART', 'TARGET', 'COSTCO', 'BEST BUY', 'STARBUCKS', 'MCDONALDS', 'DOMINOS',
    'PETROL PUMP', 'GROCERY STORE', 'PHARMACY', 'HOSPITAL', 'RESTAURANT'
  ];

  private readonly cardTypes = ['VISA', 'MASTERCARD', 'AMEX', 'RUPAY'];

  constructor(private readonly webhookUrl: string = 'http://localhost:3001/api/v1/webhooks/sms') {}

  generateSMS(bankName?: string): SMSData {
    const bank = bankName
      ? this.banks.find(b => b.name.toLowerCase().includes(bankName.toLowerCase()))
      : faker.helpers.arrayElement(this.banks);

    if (!bank) {
      throw new Error(`Bank not found: ${bankName}`);
    }

    const amount = faker.number.float({ min: 100, max: 10000, multipleOf: 0.01 });
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

  async sendSMS(smsData: SMSData): Promise<boolean> {
    try {
      // Generate a unique request ID for this SMS
      const requestId = Math.random().toString(36).substring(7);
      
      console.log(chalk.blue('📤 Sending SMS to webhook...'));
      console.log(chalk.gray('URL:'), this.webhookUrl);
      
      // Print detailed packet information before sending
      console.log(chalk.yellow('\n📦 PACKET DETAILS:'));
      console.log(chalk.yellow('═'.repeat(50)));
      console.log(chalk.cyan(`🔵 [${requestId}] 📥 OUTGOING PACKET:`));
      console.log(chalk.cyan(`   Method: POST`));
      console.log(chalk.cyan(`   URL: ${this.webhookUrl}`));
      console.log(chalk.cyan(`   Request ID: ${requestId}`));
      console.log(chalk.cyan(`   Timestamp: ${new Date().toISOString()}`));
      
      // Headers
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'SMS-Simulator/1.0.0',
        'X-Request-ID': requestId
      };
      console.log(chalk.cyan(`   Headers:`), JSON.stringify(headers, null, 6));
      
      // Body
      console.log(chalk.cyan(`   Body:`), JSON.stringify(smsData, null, 6));
      
      // Calculate packet size
      const packetSize = JSON.stringify(smsData).length;
      console.log(chalk.cyan(`   Packet Size: ${packetSize} bytes`));
      console.log(chalk.yellow('═'.repeat(50)));
      
      console.log(chalk.gray('\n📤 Transmitting packet...'));

      const response = await axios.post(this.webhookUrl, smsData, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SMS-Simulator/1.0.0',
          'X-Request-ID': requestId
        },
        timeout: 10000
      });

      console.log(chalk.green('\n✅ SMS sent successfully!'));
      console.log(chalk.gray('Response:'), response.status, response.statusText);

      if (response.data) {
        console.log(chalk.gray('Response Data:'), JSON.stringify(response.data, null, 2));
      }

      return true;
    } catch (error) {
      console.error(chalk.red('\n❌ Failed to send SMS:'));
      if (axios.isAxiosError(error)) {
        console.error(chalk.red('Status:'), error.response?.status);
        console.error(chalk.red('Message:'), error.response?.data || error.message);
      } else {
        console.error(chalk.red('Error:'), error);
      }
      return false;
    }
  }

  async sendSMSToHybridParser(smsData: SMSData, baseUrl: string = 'http://localhost:3001/api/v1'): Promise<boolean> {
    try {
      // Generate a unique request ID for this SMS
      const requestId = Math.random().toString(36).substring(7);
      const hybridUrl = `${baseUrl}/hybrid-sms/parse`;
      
      console.log(chalk.blue('🧠 Sending SMS to Hybrid LLM Parser...'));
      console.log(chalk.gray('URL:'), hybridUrl);
      
      // Print detailed packet information before sending
      console.log(chalk.yellow('\n📦 PACKET DETAILS:'));
      console.log(chalk.yellow('═'.repeat(50)));
      console.log(chalk.cyan(`🔵 [${requestId}] 📥 OUTGOING PACKET:`));
      console.log(chalk.cyan(`   Method: POST`));
      console.log(chalk.cyan(`   URL: ${hybridUrl}`));
      console.log(chalk.cyan(`   Request ID: ${requestId}`));
      console.log(chalk.cyan(`   Timestamp: ${new Date().toISOString()}`));
      
      // Prepare payload for hybrid parser
      const payload = {
        message: smsData.message,
        sender: smsData.sender,
        timestamp: smsData.timestamp
      };
      
      // Headers
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'SMS-Simulator/1.0.0 (Hybrid Parser)',
        'X-Request-ID': requestId
      };
      console.log(chalk.cyan(`   Headers:`), JSON.stringify(headers, null, 6));
      
      // Body
      console.log(chalk.cyan(`   Body:`), JSON.stringify(payload, null, 6));
      
      // Calculate packet size
      const packetSize = JSON.stringify(payload).length;
      console.log(chalk.cyan(`   Packet Size: ${packetSize} bytes`));
      console.log(chalk.yellow('═'.repeat(50)));
      
      console.log(chalk.gray('\n🧠 Processing with Hybrid Parser (LLM + Regex)...'));

      const response = await axios.post(hybridUrl, payload, {
        headers,
        timeout: 30000  // Longer timeout for LLM processing
      });

      console.log(chalk.green('\n✅ SMS parsed successfully!'));
      console.log(chalk.gray('Response:'), response.status, response.statusText);

      if (response.data) {
        console.log(chalk.yellow('\n📊 PARSED RESULTS:'));
        console.log(chalk.yellow('═'.repeat(50)));
        
        const data = response.data;
        if (data.success) {
          console.log(chalk.green('✅ Parsing Status: SUCCESS'));
          console.log(chalk.cyan('🔍 Parser Used:'), data.parserUsed || 'Unknown');
          console.log(chalk.cyan('🎯 Confidence:'), data.confidence || 'Unknown');
          
          if (data.parsedData) {
            const parsed = data.parsedData;
            console.log(chalk.cyan('\n💰 Transaction Details:'));
            console.log(chalk.white(`   Amount: ${parsed.amount || 'N/A'}`));
            console.log(chalk.white(`   Currency: ${parsed.currency || 'N/A'}`));
            console.log(chalk.white(`   Transaction Type: ${parsed.transactionType || 'N/A'}`));
            console.log(chalk.white(`   Merchant: ${parsed.merchant || 'N/A'}`));
            console.log(chalk.white(`   Date: ${parsed.date || 'N/A'}`));
            console.log(chalk.white(`   Transaction ID: ${parsed.transactionId || 'N/A'}`));
            
            if (parsed.bankInfo) {
              console.log(chalk.cyan('\n🏦 Bank Information:'));
              console.log(chalk.white(`   Bank: ${parsed.bankInfo.name || 'N/A'}`));
              console.log(chalk.white(`   Country: ${parsed.bankInfo.country || 'N/A'}`));
              console.log(chalk.white(`   Sender IDs: ${parsed.bankInfo.senderIds?.join(', ') || 'N/A'}`));
            }
            
            if (parsed.cardInfo) {
              console.log(chalk.cyan('\n💳 Card Information:'));
              console.log(chalk.white(`   Last 4 Digits: ${parsed.cardInfo.last4Digits || 'N/A'}`));
              console.log(chalk.white(`   Type: ${parsed.cardInfo.type || 'N/A'}`));
            }
            
            if (parsed.balance) {
              console.log(chalk.cyan('\n💵 Balance Information:'));
              console.log(chalk.white(`   Available: ${parsed.balance.available || 'N/A'}`));
              console.log(chalk.white(`   Currency: ${parsed.balance.currency || 'N/A'}`));
            }
          }
        } else {
          console.log(chalk.red('❌ Parsing Status: FAILED'));
          console.log(chalk.red('Error:'), data.error || 'Unknown error');
        }
        
        console.log(chalk.yellow('═'.repeat(50)));
      }

      return true;
    } catch (error) {
      console.error(chalk.red('\n❌ Failed to send SMS to Hybrid Parser:'));
      if (axios.isAxiosError(error)) {
        console.error(chalk.red('Status:'), error.response?.status);
        console.error(chalk.red('Message:'), error.response?.data || error.message);
        
        if (error.response?.data?.error) {
          console.error(chalk.red('Details:'), error.response.data.error);
        }
      } else {
        console.error(chalk.red('Error:'), error);
      }
      return false;
    }
  }

  async sendMultipleSMS(count: number, delayMs: number = 1000): Promise<void> {
    console.log(chalk.yellow(`📱 Sending ${count} SMS messages with ${delayMs}ms delay...`));

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < count; i++) {
      console.log(chalk.blue(`\n${'═'.repeat(60)}`));
      console.log(chalk.blue(`📱 SMS ${i + 1}/${count}`));
      console.log(chalk.blue(`${'═'.repeat(60)}`));

      const smsData = this.generateSMS();
      const success = await this.sendSMS(smsData);

      if (success) {
        successCount++;
      } else {
        failureCount++;
      }

      if (i < count - 1) {
        console.log(chalk.gray(`\n⏳ Waiting ${delayMs}ms before next SMS...`));
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    console.log(chalk.green(`\n${'═'.repeat(60)}`));
    console.log(chalk.green(`✅ BATCH COMPLETED! Success: ${successCount}, Failed: ${failureCount}`));
    console.log(chalk.green(`${'═'.repeat(60)}`));
  }

  async sendMultipleSMSToHybridParser(count: number, delayMs: number = 1000, baseUrl: string = 'http://localhost:3001/api/v1'): Promise<void> {
    console.log(chalk.yellow(`🧠 Sending ${count} SMS messages to Hybrid Parser with ${delayMs}ms delay...`));

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < count; i++) {
      console.log(chalk.blue(`\n${'═'.repeat(60)}`));
      console.log(chalk.blue(`🧠 SMS ${i + 1}/${count} - Hybrid Parser`));
      console.log(chalk.blue(`${'═'.repeat(60)}`));

      const smsData = this.generateSMS();
      const success = await this.sendSMSToHybridParser(smsData, baseUrl);

      if (success) {
        successCount++;
      } else {
        failureCount++;
      }

      if (i < count - 1) {
        console.log(chalk.gray(`\n⏳ Waiting ${delayMs}ms before next SMS...`));
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    console.log(chalk.green(`\n${'═'.repeat(60)}`));
    console.log(chalk.green(`🧠 HYBRID BATCH COMPLETED! Success: ${successCount}, Failed: ${failureCount}`));
    console.log(chalk.green(`${'═'.repeat(60)}`));
  }

  async interactiveMode(): Promise<void> {
    console.log(chalk.blue('🎯 SMS Simulator - Interactive Mode'));
    console.log(chalk.gray('Press Ctrl+C to exit\n'));

    while (true) {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'bank',
          message: 'Select a bank:',
          choices: this.banks.map(bank => ({
            name: `${bank.name} (${bank.sender})`,
            value: bank.name
          }))
        },
        {
          type: 'confirm',
          name: 'customize',
          message: 'Customize the SMS content?',
          default: false
        }
      ]);

      let smsData: SMSData;

      if (answers.customize) {
        const customAnswers = await inquirer.prompt([
          {
            type: 'input',
            name: 'amount',
            message: 'Enter amount:',
            default: faker.number.float({ min: 100, max: 10000, multipleOf: 0.01 }).toFixed(2)
          },
          {
            type: 'list',
            name: 'cardType',
            message: 'Select card type:',
            choices: this.cardTypes
          },
          {
            type: 'input',
            name: 'last4',
            message: 'Enter last 4 digits:',
            default: faker.string.numeric(4)
          },
          {
            type: 'input',
            name: 'merchant',
            message: 'Enter merchant name:',
            default: faker.helpers.arrayElement(this.merchants)
          }
        ]);

        const bank = this.banks.find(b => b.name === answers.bank)!;
        const date = new Date().toLocaleDateString('en-GB');

        const message = bank.pattern
          .replace('{amount}', customAnswers.amount)
          .replace('{cardType}', customAnswers.cardType)
          .replace('{last4}', customAnswers.last4)
          .replace('{merchant}', customAnswers.merchant)
          .replace('{date}', date);

        smsData = {
          message,
          sender: bank.sender,
          timestamp: new Date().toISOString()
        };
      } else {
        smsData = this.generateSMS(answers.bank);
      }

      console.log(chalk.blue('\n📱 Generated SMS:'));
      console.log(chalk.white(smsData.message));

      const sendAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'send',
          message: 'Send this SMS?',
          default: true
        }
      ]);

      if (sendAnswer.send) {
        await this.sendSMS(smsData);
      }

      const continueAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continue',
          message: 'Send another SMS?',
          default: true
        }
      ]);

      if (!continueAnswer.continue) {
        break;
      }
    }
  }

  showPatterns(): void {
    console.log(chalk.blue('📋 Available SMS Patterns:\n'));

    this.banks.forEach((bank, index) => {
      console.log(chalk.yellow(`${index + 1}. ${bank.name} (${bank.sender})`));
      console.log(chalk.gray('Pattern:'), bank.pattern);
      console.log(chalk.gray('Example:'), bank.example);
      console.log('');
    });
  }
}

// CLI Setup
const program = new Command();

program
  .name('sms-simulator')
  .description('SMS simulator for testing transaction parsing and auto-card creation')
  .version('1.0.0');

program
  .command('send')
  .description('Send a single SMS')
  .option('-b, --bank <bank>', 'Specific bank name')
  .option('-u, --url <url>', 'Webhook URL', 'http://localhost:3001/api/v1/webhooks/sms')
  .action(async (options) => {
    const simulator = new SMSSimulator(options.url);
    const smsData = simulator.generateSMS(options.bank);
    await simulator.sendSMS(smsData);
  });

program
  .command('batch')
  .description('Send multiple SMS messages')
  .option('-c, --count <number>', 'Number of SMS to send', '5')
  .option('-d, --delay <number>', 'Delay between SMS in milliseconds', '1000')
  .option('-u, --url <url>', 'Webhook URL', 'http://localhost:3001/api/v1/webhooks/sms')
  .action(async (options) => {
    const simulator = new SMSSimulator(options.url);
    await simulator.sendMultipleSMS(parseInt(options.count), parseInt(options.delay));
  });

program
  .command('interactive')
  .description('Interactive mode for manual SMS testing')
  .option('-u, --url <url>', 'Webhook URL', 'http://localhost:3001/api/v1/webhooks/sms')
  .action(async (options) => {
    const simulator = new SMSSimulator(options.url);
    await simulator.interactiveMode();
  });

program
  .command('patterns')
  .description('Show available SMS patterns and examples')
  .action(() => {
    const simulator = new SMSSimulator();
    simulator.showPatterns();
  });

program
  .command('send-hdfc-demo')
  .description('Send a demo HDFC SMS in the custom format for parser testing')
  .option('-u, --url <url>', 'Webhook URL', 'http://localhost:3001/api/v1/webhooks/sms')
  .action(async (options) => {
    const simulator = new SMSSimulator(options.url);
    const smsData = {
      message: 'Spent Rs.799 On HDFC Bank Card 0088 At Payu*Swiggy Food On 2025-07-30:19:56:11.Not You? To Block+Reissue Call 18002586161/SMS BLOCK CC 0088 to 7308080808',
      sender: 'HDFCBK',
      timestamp: new Date().toISOString()
    };
    await simulator.sendSMS(smsData);
  });

// ═══════════════════════════════════════════════════════════════════
// HYBRID LLM PARSER COMMANDS
// ═══════════════════════════════════════════════════════════════════

program
  .command('hybrid-send')
  .description('🧠 Send a single SMS to the Hybrid LLM Parser')
  .option('-b, --bank <bank>', 'Specific bank name')
  .option('-u, --url <url>', 'Base API URL', 'http://localhost:3001/api/v1')
  .action(async (options) => {
    const simulator = new SMSSimulator();
    const smsData = simulator.generateSMS(options.bank);
    await simulator.sendSMSToHybridParser(smsData, options.url);
  });

program
  .command('hybrid-batch')
  .description('🧠 Send multiple SMS messages to the Hybrid LLM Parser')
  .option('-c, --count <number>', 'Number of SMS to send', '5')
  .option('-d, --delay <number>', 'Delay between SMS in milliseconds', '2000')
  .option('-u, --url <url>', 'Base API URL', 'http://localhost:3001/api/v1')
  .action(async (options) => {
    const simulator = new SMSSimulator();
    await simulator.sendMultipleSMSToHybridParser(parseInt(options.count), parseInt(options.delay), options.url);
  });

program
  .command('hybrid-hdfc-demo')
  .description('🧠 Send the demo HDFC SMS to the Hybrid LLM Parser')
  .option('-u, --url <url>', 'Base API URL', 'http://localhost:3001/api/v1')
  .action(async (options) => {
    const simulator = new SMSSimulator();
    const smsData = {
      message: 'Spent Rs.799 On HDFC Bank Card 0088 At Payu*Swiggy Food On 2025-07-30:19:56:11.Not You? To Block+Reissue Call 18002586161/SMS BLOCK CC 0088 to 7308080808',
      sender: 'HDFCBK',
      timestamp: new Date().toISOString()
    };
    await simulator.sendSMSToHybridParser(smsData, options.url);
  });

program
  .command('compare')
  .description('🔄 Compare webhook vs hybrid parser results for the same SMS')
  .option('-b, --bank <bank>', 'Specific bank name')
  .option('-w, --webhook-url <url>', 'Webhook URL', 'http://localhost:3001/api/v1/webhooks/sms')
  .option('-h, --hybrid-url <url>', 'Hybrid API Base URL', 'http://localhost:3001/api/v1')
  .action(async (options) => {
    const simulator = new SMSSimulator(options.webhookUrl);
    const smsData = simulator.generateSMS(options.bank);
    
    console.log(chalk.magenta('\n🔄 COMPARISON MODE: Testing the same SMS with both parsers'));
    console.log(chalk.magenta('═'.repeat(70)));
    
    console.log(chalk.yellow('\n📱 GENERATED SMS:'));
    console.log(chalk.white(`Message: ${smsData.message}`));
    console.log(chalk.white(`Sender: ${smsData.sender}`));
    console.log(chalk.white(`Timestamp: ${smsData.timestamp}`));
    
    console.log(chalk.blue('\n🌐 Testing with Webhook (Traditional)...'));
    console.log(chalk.gray('═'.repeat(50)));
    await simulator.sendSMS(smsData);
    
    console.log(chalk.cyan('\n🧠 Testing with Hybrid LLM Parser...'));
    console.log(chalk.gray('═'.repeat(50)));
    await simulator.sendSMSToHybridParser(smsData, options.hybridUrl);
    
    console.log(chalk.magenta('\n✅ COMPARISON COMPLETED!'));
    console.log(chalk.magenta('═'.repeat(70)));
  });

program.parse(); 