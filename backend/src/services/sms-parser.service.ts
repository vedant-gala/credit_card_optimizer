import { createError } from '@/middleware/error.middleware';

// Types and Interfaces
export interface BankInfo {
  name: string;
  code: string;
  country: 'IN' | 'US';
  senderIds: string[];
  confidence: number;
}

export interface TransactionData {
  amount: number;
  currency: string;
  merchant: string;
  cardLast4?: string;
  cardType?: string;
  bank: string;
  dateTime: string;
  transactionType: 'debit' | 'credit' | 'transfer';
  balance?: number;
  transactionId?: string;
}

export interface ParsedSMSData {
  bank: BankInfo;
  transaction: TransactionData;
  rawMessage: string;
  sender: string;
  parsedAt: string;
  confidence: number;
  pattern: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  detectedBank?: BankInfo;
  detectedTransaction?: Partial<TransactionData>;
}

export interface SMSPattern {
  id: string;
  name: string;
  regex: RegExp;
  bank: string;
  country: 'IN' | 'US';
  example: string;
  confidence: number;
}

export class SMSParserService {
  private readonly bankPatterns: BankInfo[] = [
    // Indian Banks
    {
      name: 'HDFC Bank',
      code: 'HDFC',
      country: 'IN',
      senderIds: ['HDFCBK', 'HDFC', 'HDFCBANK'],
      confidence: 0.95
    },
    {
      name: 'State Bank of India',
      code: 'SBI',
      country: 'IN',
      senderIds: ['SBIINB', 'SBI', 'SBIN'],
      confidence: 0.95
    },
    {
      name: 'ICICI Bank',
      code: 'ICICI',
      country: 'IN',
      senderIds: ['ICICIB', 'ICICI', 'ICICIBANK'],
      confidence: 0.95
    },
    {
      name: 'Axis Bank',
      code: 'AXIS',
      country: 'IN',
      senderIds: ['AXISBK', 'AXIS', 'AXISBANK'],
      confidence: 0.95
    },
    {
      name: 'Kotak Mahindra Bank',
      code: 'KOTAK',
      country: 'IN',
      senderIds: ['KOTAK', 'KOTAKBANK'],
      confidence: 0.90
    },
    // US Banks
    {
      name: 'Chase Bank',
      code: 'CHASE',
      country: 'US',
      senderIds: ['CHASE', 'JPMORGAN'],
      confidence: 0.95
    },
    {
      name: 'Bank of America',
      code: 'BOA',
      country: 'US',
      senderIds: ['BOA', 'BANKOFAMERICA'],
      confidence: 0.95
    },
    {
      name: 'Wells Fargo',
      code: 'WELLS',
      country: 'US',
      senderIds: ['WELLS', 'WELLSFARGO'],
      confidence: 0.95
    }
  ];

  private readonly smsPatterns: SMSPattern[] = [
    // HDFC Bank Patterns
    {
      id: 'hdfc_spent_format',
      name: 'HDFC Spent Format',
      regex: /Spent Rs\.?(\d+(?:,\d+)*(?:\.\d+)?) On ([A-Za-z ]+) Card (\d{4}) At ([^O]+) On (\d{4}-\d{2}-\d{2}:\d{2}:\d{2}:\d{2})/i,
      bank: 'HDFC',
      country: 'IN',
      example: 'Spent Rs.799 On HDFC Bank Card 0088 At Payu*Swiggy Food On 2025-07-30:19:56:11',
      confidence: 0.95
    },
    {
      id: 'hdfc_standard_format',
      name: 'HDFC Standard Format',
      regex: /HDFC Bank: Rs\.?(\d+(?:,\d+)*(?:\.\d+)?) spent on ([A-Z]+) card ending (\d{4}) at ([^o]+) on (\d{1,2}\/\d{1,2}\/\d{4})/i,
      bank: 'HDFC',
      country: 'IN',
      example: 'HDFC Bank: Rs.1500.00 spent on VISA card ending 1234 at AMAZON on 15/12/2024',
      confidence: 0.90
    },
    // SBI Patterns
    {
      id: 'sbi_standard_format',
      name: 'SBI Standard Format',
      regex: /SBI: Rs\.?(\d+(?:,\d+)*(?:\.\d+)?) spent on ([A-Z]+) ending (\d{4}) at ([^o]+) on (\d{1,2}\/\d{1,2}\/\d{4})/i,
      bank: 'SBI',
      country: 'IN',
      example: 'SBI: Rs.2500.00 spent on MASTERCARD ending 5678 at FLIPKART on 16/12/2024',
      confidence: 0.90
    },
    // ICICI Patterns
    {
      id: 'icici_standard_format',
      name: 'ICICI Standard Format',
      regex: /ICICI Bank: Rs\.?(\d+(?:,\d+)*(?:\.\d+)?) spent on ([A-Z]+) card ending (\d{4}) at ([^o]+) on (\d{1,2}\/\d{1,2}\/\d{4})/i,
      bank: 'ICICI',
      country: 'IN',
      example: 'ICICI Bank: Rs.3000.00 spent on VISA card ending 9012 at SWIGGY on 17/12/2024',
      confidence: 0.90
    },
    // US Bank Patterns
    {
      id: 'chase_standard_format',
      name: 'Chase Standard Format',
      regex: /Chase: \$(\d+(?:,\d+)*(?:\.\d+)?) spent on ([A-Z]+) card ending (\d{4}) at ([^o]+) on (\d{1,2}\/\d{1,2}\/\d{4})/i,
      bank: 'CHASE',
      country: 'US',
      example: 'Chase: $50.00 spent on VISA card ending 1234 at AMAZON on 12/15/2024',
      confidence: 0.90
    }
  ];

  private readonly transactionKeywords = {
    debit: ['spent', 'debited', 'purchase', 'paid', 'charged', 'withdrawn'],
    credit: ['credited', 'received', 'refund', 'deposit', 'added'],
    transfer: ['transferred', 'sent', 'received', 'moved']
  };

  // Currency symbols
  /*
  private readonly currencySymbols = {
    'INR': ['Rs.', '₹', 'INR'],
    'USD': ['$', 'USD', 'US$'],
    'EUR': ['€', 'EUR'],
    'GBP': ['£', 'GBP']
  };
  */

  async parseSMS(message: string, sender: string): Promise<ParsedSMSData> {
    try {
      // Detect bank
      const bank = this.detectBank(message, sender);
      if (!bank) {
        throw createError('Bank not detected from SMS', 400);
      }

      // Extract transaction data
      const transaction = this.extractTransaction(message, bank);
      if (!transaction) {
        throw createError('Transaction data not extracted from SMS', 400);
      }

      // Find matching pattern
      const pattern = this.findMatchingPattern(message, bank.code);
      if (!pattern) {
        throw createError('SMS pattern not recognized', 400);
      }

      return {
        bank,
        transaction,
        rawMessage: message,
        sender,
        parsedAt: new Date().toISOString(),
        confidence: pattern.confidence * bank.confidence,
        pattern: pattern.id
      };
    } catch (error: any) {
      throw createError(`SMS parsing failed: ${error.message || 'Unknown error'}`, 400);
    }
  }

  detectBank(message: string, sender: string): BankInfo | null {
    // First, try to detect by sender ID
    const senderMatch = this.bankPatterns.find(bank =>
      bank.senderIds.some(id => 
        sender.toUpperCase().includes(id.toUpperCase())
      )
    );

    if (senderMatch) {
      return senderMatch;
    }

    // Then, try to detect by message content
    const messageMatch = this.bankPatterns.find(bank =>
      message.toUpperCase().includes(bank.name.toUpperCase()) ||
      message.toUpperCase().includes(bank.code.toUpperCase())
    );

    return messageMatch || null;
  }

  extractTransaction(message: string, bank: BankInfo): TransactionData | null {
    // Find matching pattern for the bank
    const pattern = this.findMatchingPattern(message, bank.code);
    if (!pattern) {
      return null;
    }

    const match = message.match(pattern.regex);
    if (!match) {
      return null;
    }

    // Extract data based on pattern
    let amount: number;
    let currency: string;
    let merchant: string;
    let cardLast4: string;
    let cardType: string;
    let dateTime: string;

    if (pattern.id === 'hdfc_spent_format') {
      amount = this.parseAmount(match[1] || '0', 'INR');
      currency = 'INR';
      merchant = match[4]?.trim() || '';
      cardLast4 = match[3] || '';
      cardType = 'UNKNOWN';
      dateTime = match[5] || '';
    } else if (pattern.id === 'hdfc_standard_format') {
      amount = this.parseAmount(match[1] || '0', 'INR');
      currency = 'INR';
      merchant = match[4]?.trim() || '';
      cardLast4 = match[3] || '';
      cardType = match[2] || '';
      dateTime = match[5] || '';
    } else if (pattern.id === 'sbi_standard_format') {
      amount = this.parseAmount(match[1] || '0', 'INR');
      currency = 'INR';
      merchant = match[4]?.trim() || '';
      cardLast4 = match[3] || '';
      cardType = match[2] || '';
      dateTime = match[5] || '';
    } else if (pattern.id === 'icici_standard_format') {
      amount = this.parseAmount(match[1] || '0', 'INR');
      currency = 'INR';
      merchant = match[4]?.trim() || '';
      cardLast4 = match[3] || '';
      cardType = match[2] || '';
      dateTime = match[5] || '';
    } else if (pattern.id === 'chase_standard_format') {
      amount = this.parseAmount(match[1] || '0', 'USD');
      currency = 'USD';
      merchant = match[4]?.trim() || '';
      cardLast4 = match[3] || '';
      cardType = match[2] || '';
      dateTime = match[5] || '';
    } else {
      return null;
    }

    // Determine transaction type
    const transactionType = this.determineTransactionType(message);

    // Extract additional data
    const balance = this.extractBalance(message);
    const transactionId = this.extractTransactionId(message);

    return {
      amount,
      currency,
      merchant,
      cardLast4,
      cardType,
      bank: bank.name,
      dateTime,
      transactionType,
      ...(balance !== undefined && { balance }),
      ...(transactionId !== undefined && { transactionId })
    };
  }

  private findMatchingPattern(message: string, bankCode: string): SMSPattern | null {
    return this.smsPatterns.find(pattern => 
      pattern.bank === bankCode && pattern.regex.test(message)
    ) || null;
  }

  private parseAmount(amountStr: string, _defaultCurrency: string = 'INR'): number {
    // Remove currency symbols and commas
    const cleanAmount = amountStr.replace(/[^\d.,]/g, '').replace(/,/g, '');
    return parseFloat(cleanAmount);
  }

  private determineTransactionType(message: string): 'debit' | 'credit' | 'transfer' {
    const lowerMessage = message.toLowerCase();
    
    if (this.transactionKeywords.debit.some(keyword => lowerMessage.includes(keyword))) {
      return 'debit';
    }
    
    if (this.transactionKeywords.credit.some(keyword => lowerMessage.includes(keyword))) {
      return 'credit';
    }
    
    if (this.transactionKeywords.transfer.some(keyword => lowerMessage.includes(keyword))) {
      return 'transfer';
    }
    
    // Default to debit for spending transactions
    return 'debit';
  }

  private extractBalance(message: string): number | undefined {
    const balanceMatch = message.match(/balance[:\s]*[₹$]?(\d+(?:,\d+)*(?:\.\d+)?)/i);
    return balanceMatch ? this.parseAmount(balanceMatch[1] || '0', 'INR') : undefined;
  }

  private extractTransactionId(message: string): string | undefined {
    const idMatch = message.match(/(?:ref|txn|transaction)[\s#:]*([A-Z0-9]{8,})/i);
    return idMatch ? idMatch[1] : undefined;
  }

  async validateSMS(message: string, sender: string): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!message || message.trim().length === 0) {
      errors.push('Message is empty');
    }

    if (!sender || sender.trim().length === 0) {
      errors.push('Sender is empty');
    }

    if (message.length > 500) {
      warnings.push('Message is very long, may contain extra information');
    }

    // Try to detect bank
    const detectedBank = this.detectBank(message, sender);
    if (!detectedBank) {
      errors.push('Bank not detected from message or sender');
    }

    // Try to extract transaction
    const detectedTransaction = detectedBank ? this.extractTransaction(message, detectedBank) : null;
    if (!detectedTransaction) {
      errors.push('Transaction data could not be extracted');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      ...(detectedBank && { detectedBank }),
      ...(detectedTransaction && { detectedTransaction })
    };
  }

  getSupportedBanks(): BankInfo[] {
    return this.bankPatterns;
  }

  getSupportedPatterns(): SMSPattern[] {
    return this.smsPatterns;
  }

  async getParsingStats(): Promise<any> {
    // This would typically query a database for parsing statistics
    return {
      totalPatterns: this.smsPatterns.length,
      totalBanks: this.bankPatterns.length,
      supportedCountries: ['IN', 'US'],
      lastUpdated: new Date().toISOString()
    };
  }
} 