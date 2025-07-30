import { SMSParserService, ParsedSMSData } from './sms-parser.service';
import { Phi2SMSParserService, LLMParsedSMS, ParserStats } from './phi2-sms-parser.service';

export interface HybridParserConfig {
  useLLM: boolean;
  llmConfidenceThreshold: number;
  enableCaching: boolean;
  fallbackToRegex: boolean;
  ollamaUrl: string;
  model: string;
}

export interface HybridParserStats extends ParserStats {
  hybridRequests: number;
  llmSuccessRate: number;
  regexFallbackRate: number;
  averageConfidence: number;
}

export class HybridSMSParserService {
  private llmParser: Phi2SMSParserService;
  private regexParser: SMSParserService;
  private config: HybridParserConfig;
  private stats: HybridParserStats;

  constructor(config: Partial<HybridParserConfig> = {}) {
    this.config = {
      useLLM: true,
      llmConfidenceThreshold: 0.8,
      enableCaching: true,
      fallbackToRegex: true,
      ollamaUrl: 'http://localhost:11434',
      model: 'phi',
      ...config
    };

    this.llmParser = new Phi2SMSParserService(this.config.ollamaUrl);
    this.llmParser.setModel(this.config.model || 'phi');
    this.regexParser = new SMSParserService();
    
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      llmRequests: 0,
      regexFallbacks: 0,
      averageResponseTime: 0,
      accuracy: 0,
      hybridRequests: 0,
      llmSuccessRate: 0,
      regexFallbackRate: 0,
      averageConfidence: 0
    };

    // Set model if provided
    if (this.config.model) {
      this.llmParser.setModel(this.config.model);
    }
  }

  async parseSMS(message: string, sender: string): Promise<ParsedSMSData> {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);
    this.stats.totalRequests++;
    this.stats.hybridRequests++;

    console.log(`🔄 [${requestId}] HYBRID PARSER INITIATED`);
    console.log(`🔄 [${requestId}] 📝 SMS Message: "${message}"`);
    console.log(`🔄 [${requestId}] 📧 Sender: "${sender}"`);
    console.log(`🔄 [${requestId}] ⚙️ Config:`, JSON.stringify(this.config, null, 2));

    try {
      // Try LLM first if enabled
      if (this.config.useLLM) {
        console.log(`🔄 [${requestId}] 🧠 Attempting LLM parsing...`);
        
        try {
          const llmResult = await this.llmParser.parseSMS(message, sender);
          
          console.log(`🔄 [${requestId}] 🧠 LLM Result:`, JSON.stringify(llmResult, null, 2));
          console.log(`🔄 [${requestId}] 🎯 LLM Confidence: ${llmResult.confidence}`);
          console.log(`🔄 [${requestId}] 📊 Confidence Threshold: ${this.config.llmConfidenceThreshold}`);
          
          // Use LLM result if confidence is above threshold
          if (llmResult.confidence >= this.config.llmConfidenceThreshold) {
            const processingTime = Date.now() - startTime;
            this.updateStats(processingTime, llmResult.confidence, 'llm');
            
            console.log(`🔄 [${requestId}] ✅ LLM parsing successful (${processingTime}ms, confidence: ${llmResult.confidence})`);
            const convertedResult = this.convertLLMToParsedSMSData(llmResult);
            console.log(`🔄 [${requestId}] 🔄 Converted Result:`, JSON.stringify(convertedResult, null, 2));
            return convertedResult;
          } else {
            console.log(`🔄 [${requestId}] ⚠️ LLM confidence too low (${llmResult.confidence} < ${this.config.llmConfidenceThreshold}), falling back to regex`);
            this.stats.regexFallbacks++;
          }
        } catch (error) {
          console.error(`🔄 [${requestId}] ❌ LLM parsing failed:`, error);
          this.stats.regexFallbacks++;
        }
      } else {
        console.log(`🔄 [${requestId}] 🚫 LLM parsing disabled, using regex only`);
      }

      // Fallback to regex parsing
      if (this.config.fallbackToRegex) {
        console.log(`🔄 [${requestId}] 🔧 Using regex fallback parsing...`);
        const regexResult = await this.regexParser.parseSMS(message, sender);
        const processingTime = Date.now() - startTime;
        
        console.log(`🔄 [${requestId}] 🔧 Regex Result:`, JSON.stringify(regexResult, null, 2));
        console.log(`🔄 [${requestId}] ✅ Regex parsing completed (${processingTime}ms)`);
        
        this.updateStats(processingTime, 0.7, 'regex'); // Default confidence for regex
        return regexResult;
      }

      throw new Error('No parsing method available');
    } catch (error) {
      console.error('📱 HYBRID PARSER: All parsing methods failed:', error);
      throw error;
    }
  }

  private convertLLMToParsedSMSData(llmResult: LLMParsedSMS): ParsedSMSData {
    return {
      bank: {
        name: llmResult.bank,
        code: this.getBankCode(llmResult.bank),
        country: this.getBankCountry(llmResult.bank),
        confidence: llmResult.confidence,
        senderIds: [this.getBankCode(llmResult.bank)]
      },
      transaction: {
        amount: llmResult.amount,
        currency: llmResult.currency,
        merchant: llmResult.merchant,
        cardLast4: llmResult.cardLast4,
        cardType: 'UNKNOWN', // LLM doesn't extract card type
        bank: llmResult.bank,
        dateTime: llmResult.dateTime,
        transactionType: llmResult.transactionType
      },
      rawMessage: llmResult.rawMessage,
      sender: '', // Will be set by caller
      parsedAt: new Date().toISOString(),
      confidence: llmResult.confidence,
      pattern: 'llm_parsed'
    };
  }

  private getBankCode(bankName: string): string {
    const bankCodes: Record<string, string> = {
      'HDFC Bank': 'HDFC',
      'State Bank of India': 'SBI',
      'ICICI Bank': 'ICICI',
      'Axis Bank': 'AXIS',
      'Kotak Bank': 'KOTAK',
      'Chase': 'CHASE',
      'Bank of America': 'BOA',
      'Wells Fargo': 'WF'
    };
    return bankCodes[bankName] || 'UNKNOWN';
  }

  private getBankCountry(bankName: string): 'IN' | 'US' {
    const indianBanks = ['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Bank'];
    return indianBanks.includes(bankName) ? 'IN' : 'US';
  }

  private updateStats(processingTime: number, confidence: number, method: 'llm' | 'regex'): void {
    const totalTime = this.stats.averageResponseTime * (this.stats.totalRequests - 1) + processingTime;
    this.stats.averageResponseTime = totalTime / this.stats.totalRequests;
    
    // Update confidence stats
    const totalConfidence = this.stats.averageConfidence * (this.stats.totalRequests - 1) + confidence;
    this.stats.averageConfidence = totalConfidence / this.stats.totalRequests;
    
    // Update success rates
    if (method === 'llm') {
      this.stats.llmSuccessRate = (this.stats.llmRequests - this.stats.regexFallbacks) / this.stats.llmRequests;
    }
    
    this.stats.regexFallbackRate = this.stats.regexFallbacks / this.stats.totalRequests;
  }

  // Configuration methods
  setConfig(config: Partial<HybridParserConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (config.ollamaUrl) {
      this.llmParser.setOllamaUrl(config.ollamaUrl);
    }
    
    if (config.model) {
      this.llmParser.setModel(config.model);
    }
    
    console.log('📱 HYBRID PARSER: Configuration updated:', this.config);
  }

  getConfig(): HybridParserConfig {
    return { ...this.config };
  }

  // Statistics and monitoring
  getStats(): HybridParserStats {
    return { ...this.stats };
  }

  async getDetailedStats(): Promise<{
    config: HybridParserConfig;
    stats: HybridParserStats;
    llmStats: ParserStats;
    connectionStatus: boolean;
    availableModels: string[];
  }> {
    const llmStats = this.llmParser.getStats();
    const connectionStatus = await this.llmParser.testConnection();
    const availableModels = await this.llmParser.getAvailableModels();

    return {
      config: this.getConfig(),
      stats: this.getStats(),
      llmStats,
      connectionStatus,
      availableModels
    };
  }

  // Control methods
  enableLLM(): void {
    this.config.useLLM = true;
    console.log('📱 HYBRID PARSER: LLM parsing enabled');
  }

  disableLLM(): void {
    this.config.useLLM = false;
    console.log('📱 HYBRID PARSER: LLM parsing disabled');
  }

  setConfidenceThreshold(threshold: number): void {
    this.config.llmConfidenceThreshold = Math.max(0, Math.min(1, threshold));
    console.log(`📱 HYBRID PARSER: Confidence threshold set to ${this.config.llmConfidenceThreshold}`);
  }

  clearCache(): void {
    this.llmParser.clearCache();
    console.log('📱 HYBRID PARSER: Cache cleared');
  }

  // Testing methods
  async testLLMConnection(): Promise<boolean> {
    return await this.llmParser.testConnection();
  }

  async testParsing(message: string, sender: string): Promise<{
    llmResult: LLMParsedSMS | undefined;
    regexResult: ParsedSMSData | undefined;
    hybridResult: ParsedSMSData;
    method: 'llm' | 'regex' | 'hybrid';
    processingTime: number;
  }> {
    const startTime = Date.now();
    
    let llmResult: LLMParsedSMS | undefined;
    let regexResult: ParsedSMSData | undefined;
    let method: 'llm' | 'regex' | 'hybrid' = 'hybrid';
    
    // Test LLM
    if (this.config.useLLM) {
      try {
        llmResult = await this.llmParser.parseSMS(message, sender);
        if (llmResult.confidence >= this.config.llmConfidenceThreshold) {
          method = 'llm';
        }
      } catch (error) {
        console.log('LLM test failed:', error);
      }
    }
    
    // Test regex
    try {
      regexResult = await this.regexParser.parseSMS(message, sender);
      if (method !== 'llm') {
        method = 'regex';
      }
    } catch (error) {
      console.log('Regex test failed:', error);
    }
    
    // Get hybrid result
    const hybridResult = await this.parseSMS(message, sender);
    const processingTime = Date.now() - startTime;
    
    return {
      llmResult,
      regexResult,
      hybridResult,
      method,
      processingTime
    };
  }

  // Batch processing
  async parseMultipleSMS(smsList: Array<{message: string, sender: string}>): Promise<ParsedSMSData[]> {
    const results: ParsedSMSData[] = [];
    
    for (const sms of smsList) {
      try {
        const result = await this.parseSMS(sms.message, sms.sender);
        results.push(result);
      } catch (error) {
        console.error(`Failed to parse SMS: ${sms.message}`, error);
        // Add a default result for failed parsing
        results.push({
          bank: { name: 'Unknown', code: 'UNKNOWN', country: 'IN', confidence: 0, senderIds: ['UNKNOWN'] },
          transaction: {
            amount: 0,
            currency: 'INR',
            merchant: 'Unknown',
            cardLast4: '',
            cardType: 'UNKNOWN',
            bank: 'Unknown',
            dateTime: new Date().toISOString(),
            transactionType: 'debit'
          },
          rawMessage: sms.message,
          sender: sms.sender,
          parsedAt: new Date().toISOString(),
          confidence: 0,
          pattern: 'failed'
        });
      }
    }
    
    return results;
  }
} 