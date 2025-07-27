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
      console.log(chalk.blue('📤 Sending SMS to webhook...'));
      console.log(chalk.gray('URL:'), this.webhookUrl);
      console.log(chalk.gray('Data:'), JSON.stringify(smsData, null, 2));

      const response = await axios.post(this.webhookUrl, smsData, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SMS-Simulator/1.0.0'
        },
        timeout: 10000
      });

      console.log(chalk.green('✅ SMS sent successfully!'));
      console.log(chalk.gray('Response:'), response.status, response.statusText);

      if (response.data) {
        console.log(chalk.gray('Response Data:'), JSON.stringify(response.data, null, 2));
      }

      return true;
    } catch (error) {
      console.error(chalk.red('❌ Failed to send SMS:'));
      if (axios.isAxiosError(error)) {
        console.error(chalk.red('Status:'), error.response?.status);
        console.error(chalk.red('Message:'), error.response?.data || error.message);
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
      console.log(chalk.blue(`\n--- SMS ${i + 1}/${count} ---`));

      const smsData = this.generateSMS();
      const success = await this.sendSMS(smsData);

      if (success) {
        successCount++;
      } else {
        failureCount++;
      }

      if (i < count - 1) {
        console.log(chalk.gray(`Waiting ${delayMs}ms before next SMS...`));
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    console.log(chalk.green(`\n✅ Completed! Success: ${successCount}, Failed: ${failureCount}`));
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

program.parse(); 