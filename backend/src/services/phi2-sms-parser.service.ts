import axios from 'axios';

export interface LLMParsedSMS {
  bank: string;
  amount: number;
  currency: string;
  merchant: string;
  cardLast4: string;
  transactionType: 'debit' | 'credit';
  dateTime: string;
  confidence: number;
  rawMessage: string;
  model: string;
  processingTime: number;
}

export interface ParserStats {
  totalRequests: number;
  cacheHits: number;
  llmRequests: number;
  regexFallbacks: number;
  averageResponseTime: number;
  accuracy: number;
}

export class Phi2SMSParserService {
  private model: string = 'phi';
  private ollamaUrl: string;
  private cache = new Map<string, LLMParsedSMS>();
  private stats: ParserStats = {
    totalRequests: 0,
    cacheHits: 0,
    llmRequests: 0,
    regexFallbacks: 0,
    averageResponseTime: 0,
    accuracy: 0
  };

  constructor(ollamaUrl: string = 'http://localhost:11434') {
    this.ollamaUrl = ollamaUrl;
  }

  async parseSMS(message: string, sender: string): Promise<LLMParsedSMS> {
    const startTime = Date.now();
    this.stats.totalRequests++;

    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(message, sender);
      if (this.cache.has(cacheKey)) {
        this.stats.cacheHits++;
        const cached = this.cache.get(cacheKey)!;
        console.log(`📱 PHI2 PARSER: Cache hit for SMS parsing (${Date.now() - startTime}ms)`);
        return cached;
      }

      // Parse with LLM
      this.stats.llmRequests++;
      const result = await this.parseWithLLM(message, sender);
      
      // Cache result
      this.cache.set(cacheKey, result);
      
      const processingTime = Date.now() - startTime;
      this.updateStats(processingTime);
      
      console.log(`📱 PHI2 PARSER: SMS parsed successfully (${processingTime}ms, confidence: ${result.confidence})`);
      return result;
    } catch (error) {
      console.error('📱 PHI2 PARSER: LLM parsing failed, falling back to regex:', error);
      this.stats.regexFallbacks++;
      
      // Fallback to regex parsing (implement later)
      const fallbackResult = await this.parseWithRegex(message, sender);
      const processingTime = Date.now() - startTime;
      this.updateStats(processingTime);
      
      return fallbackResult;
    }
  }

  private async parseWithLLM(message: string, sender: string): Promise<LLMParsedSMS> {
    const prompt = this.buildOptimizedPrompt(message, sender);
    const requestId = Math.random().toString(36).substring(7);
    const requestUrl = `${this.ollamaUrl}/api/generate`;
    
    const requestPayload = {
      model: this.model,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.1, // Low for consistency, but not too low to avoid slowness
        top_p: 0.9,
        num_predict: 150, // Limit response length for faster inference
        stop: ['\n\n', '---', '```', 'JSON:', 'Example:'],
        num_ctx: 2048 // Smaller context window for faster processing
      }
    };

    console.log(`🧠 [${requestId}] 🚀 OLLAMA REQUEST INITIATED`);
    console.log(`🧠 [${requestId}] 🌐 URL: ${requestUrl}`);
    console.log(`🧠 [${requestId}] 🤖 Model: ${this.model}`);
    console.log(`🧠 [${requestId}] 📝 SMS Message: "${message}"`);
    console.log(`🧠 [${requestId}] 📧 Sender: "${sender}"`);
    console.log(`🧠 [${requestId}] 📊 Request Payload:`, JSON.stringify(requestPayload, null, 2));
    
    try {
      const startTime = Date.now();
      
      const response = await axios.post(requestUrl, requestPayload, {
        timeout: 60000, // Increased to 60 seconds
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId
        }
      });

      const duration = Date.now() - startTime;

      console.log(`🧠 [${requestId}] ✅ OLLAMA RESPONSE RECEIVED`);
      console.log(`🧠 [${requestId}] ⏱️ Duration: ${duration}ms`);
      console.log(`🧠 [${requestId}] 📊 Response Status: ${response.status} ${response.statusText}`);
      console.log(`🧠 [${requestId}] 📦 Response Headers:`, JSON.stringify(response.headers, null, 2));
      console.log(`🧠 [${requestId}] 📄 Raw Response Data:`, JSON.stringify(response.data, null, 2));
      
      if (response.data?.response) {
        console.log(`🧠 [${requestId}] 🎯 LLM Generated Text: "${response.data.response}"`);
      }

      const parsedResult = this.parseResponse(response.data.response, message);
      
      console.log(`🧠 [${requestId}] 🔍 Parsed Result:`, JSON.stringify(parsedResult, null, 2));
      
      return parsedResult;
      
    } catch (error: any) {
      console.error(`🧠 [${requestId}] ❌ OLLAMA REQUEST FAILED`);
      console.error(`🧠 [${requestId}] 🔥 Error Type: ${error.constructor.name}`);
      
      if (axios.isAxiosError(error)) {
        console.error(`🧠 [${requestId}] 📊 HTTP Status: ${error.response?.status}`);
        console.error(`🧠 [${requestId}] 📊 HTTP Status Text: ${error.response?.statusText}`);
        console.error(`🧠 [${requestId}] 🌐 Request URL: ${error.config?.url}`);
        console.error(`🧠 [${requestId}] 📦 Request Method: ${error.config?.method}`);
        console.error(`🧠 [${requestId}] 📄 Response Data:`, error.response?.data);
        console.error(`🧠 [${requestId}] 📦 Response Headers:`, error.response?.headers);
        
        if (error.code) {
          console.error(`🧠 [${requestId}] 🔧 Error Code: ${error.code}`);
        }
        
        if (error.message) {
          console.error(`🧠 [${requestId}] 💬 Error Message: ${error.message}`);
        }
      } else {
        console.error(`🧠 [${requestId}] ⚠️ Non-Axios Error:`, error);
      }
      
      throw error;
    }
  }

  private buildOptimizedPrompt(message: string, sender: string): string {
    return `You are a JSON parser. Extract transaction data from SMS.

SMS: "${message}"
Sender: "${sender}"

Output ONLY valid JSON (no explanations):
{
  "bank": "Bank name",
  "amount": 799,
  "currency": "INR",
  "merchant": "Merchant name", 
  "cardLast4": "0088",
  "transactionType": "debit",
  "confidence": 0.9
}`;
  }

  private parseResponse(response: string, originalMessage: string): LLMParsedSMS {
    try {
      console.log(`🧠 Parsing LLM response: "${response}"`);
      
      // Extract JSON from response - try multiple approaches
      let jsonText = '';
      
      // Approach 1: Look for JSON object
      const jsonMatch = response.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      } else {
        // Approach 2: Look for JSON between common delimiters
        const delimitedMatch = response.match(/```json\s*(\{[\s\S]*?\})\s*```/) || 
                              response.match(/```\s*(\{[\s\S]*?\})\s*```/) ||
                              response.match(/JSON:\s*(\{[\s\S]*?\})/);
        if (delimitedMatch) {
          jsonText = delimitedMatch[1] || '';
        } else {
          // Approach 3: Try to find any valid JSON structure
          const lines = response.split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('{') && trimmed.includes('"')) {
              try {
                JSON.parse(trimmed);
                jsonText = trimmed;
                break;
              } catch {
                continue;
              }
            }
          }
        }
      }
      
      if (!jsonText) {
        console.error(`🧠 No valid JSON found in response: "${response}"`);
        throw new Error('No JSON found in LLM response');
      }

      console.log(`🧠 Extracted JSON: "${jsonText}"`);
      const parsed = JSON.parse(jsonText);
      
      // Validate and clean the data
      return {
        bank: this.cleanBankName(parsed.bank || 'Unknown'),
        amount: this.parseAmount(parsed.amount),
        currency: parsed.currency || 'INR',
        merchant: this.cleanMerchantName(parsed.merchant || 'Unknown'),
        cardLast4: this.extractCardDigits(parsed.cardLast4 || ''),
        transactionType: this.validateTransactionType(parsed.transactionType || 'debit'),
        dateTime: this.parseDateTime(parsed.dateTime || null),
        confidence: this.calculateConfidence(parsed),
        rawMessage: originalMessage,
        model: this.model,
        processingTime: 0 // Will be set by caller
      };
    } catch (error) {
      console.error('Failed to parse LLM response:', response);
      throw new Error('Invalid LLM response format');
    }
  }

  private async parseWithRegex(message: string, sender: string): Promise<LLMParsedSMS> {
    // Fallback to regex parsing (simplified version)
    // This would integrate with your existing SMSParserService
    const bank = this.extractBankFromSender(sender);
    const amount = this.extractAmountFromMessage(message);
    const merchant = this.extractMerchantFromMessage(message);
    const cardLast4 = this.extractCardFromMessage(message);
    
    return {
      bank: bank,
      amount: amount,
      currency: 'INR',
      merchant: merchant,
      cardLast4: cardLast4,
      transactionType: 'debit',
      dateTime: new Date().toISOString(),
      confidence: 0.6, // Lower confidence for regex fallback
      rawMessage: message,
      model: 'regex-fallback',
      processingTime: 0
    };
  }

  // Helper methods for data cleaning and validation
  private cleanBankName(bank: string): string {
    if (!bank || bank === 'Unknown') return 'Unknown';
    
    // Remove common suffixes and clean bank names
    return bank
      .replace(/\s+(Bank|Ltd|Limited|Corp|Corporation)$/i, '')
      .replace(/^HDFC$/, 'HDFC Bank')
      .replace(/^SBI$/, 'State Bank of India')
      .replace(/^ICICI$/, 'ICICI Bank')
      .replace(/^Axis$/, 'Axis Bank');
  }

  private parseAmount(amount: any): number {
    if (typeof amount === 'number') return amount;
    if (typeof amount === 'string') {
      return parseFloat(amount.replace(/[^\d.]/g, '')) || 0;
    }
    return 0;
  }

  private cleanMerchantName(merchant: string): string {
    if (!merchant || merchant === 'Unknown') return 'Unknown';
    
    // Remove payment gateway prefixes
    return merchant
      .replace(/^(Payu\*|Razorpay\*|Stripe\*|Gateway\*)/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractCardDigits(cardInfo: string): string {
    if (!cardInfo) return '';
    
    // Extract last 4 digits
    const match = cardInfo.match(/\d{4}$/);
    return match ? match[0] : '';
  }

  private validateTransactionType(type: string): 'debit' | 'credit' {
    const cleanType = type.toLowerCase().trim();
    return cleanType === 'credit' ? 'credit' : 'debit';
  }

  private parseDateTime(dateTime: string | null | undefined): string {
    if (!dateTime) return new Date().toISOString();
    
    try {
      // Handle various date formats
      let parsedDate: Date;
      
      if (dateTime.includes('T')) {
        // ISO format
        parsedDate = new Date(dateTime);
      } else if (dateTime.includes(':')) {
        // Custom format like "2025-07-30:19:56:11"
        const parts = dateTime.split(':');
        if (parts.length >= 2) {
          const datePart = parts[0] || '';
          const timePart = parts.slice(1).join(':');
          const dateComponents = datePart.split('-');
          const timeComponents = timePart.split(':');
          
          if (dateComponents.length >= 3 && timeComponents.length >= 3) {
            const year = parseInt(dateComponents[0] || '0');
            const month = parseInt(dateComponents[1] || '1') - 1;
            const day = parseInt(dateComponents[2] || '1');
            const hour = parseInt(timeComponents[0] || '0');
            const minute = parseInt(timeComponents[1] || '0');
            const second = parseInt(timeComponents[2] || '0');
            
            parsedDate = new Date(year, month, day, hour, minute, second);
          } else {
            parsedDate = new Date(dateTime);
          }
        } else {
          parsedDate = new Date(dateTime);
        }
      } else {
        // Try standard parsing
        parsedDate = new Date(dateTime);
      }
      
      if (isNaN(parsedDate.getTime())) {
        return new Date().toISOString();
      }
      
      return parsedDate.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  private calculateConfidence(data: any): number {
    let confidence = 0.2; // Base confidence
    
    // Add confidence based on available data (excluding dateTime since we don't expect LLM to provide it reliably)
    if (data.bank && data.bank !== 'Unknown') confidence += 0.2;
    if (data.amount && data.amount > 0) confidence += 0.2;
    if (data.merchant && data.merchant !== 'Unknown') confidence += 0.2;
    if (data.cardLast4 && data.cardLast4.length === 4) confidence += 0.2;
    if (data.transactionType) confidence += 0.1;
    if (data.currency) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  // Fallback regex methods
  private extractBankFromSender(sender: string): string {
    const bankPatterns = {
      'HDFC': 'HDFC Bank',
      'SBI': 'State Bank of India',
      'ICICI': 'ICICI Bank',
      'AXIS': 'Axis Bank',
      'KOTAK': 'Kotak Bank'
    };
    
    for (const [code, name] of Object.entries(bankPatterns)) {
      if (sender.toUpperCase().includes(code)) {
        return name;
      }
    }
    return 'Unknown';
  }

  private extractAmountFromMessage(message: string): number {
    const match = message.match(/Rs\.?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i);
    return match && match[1] ? parseFloat(match[1].replace(/,/g, '')) : 0;
  }

  private extractMerchantFromMessage(message: string): string {
    const match = message.match(/At\s+([^O]+?)(?:\s+On|\s*$)/i);
    return match && match[1] ? match[1].trim() : 'Unknown';
  }

  private extractCardFromMessage(message: string): string {
    const match = message.match(/Card\s+(\d{4})/i);
    return match && match[1] ? match[1] : '';
  }

  private generateCacheKey(message: string, sender: string): string {
    return `${sender}:${message.toLowerCase().replace(/\s+/g, '')}`;
  }

  private updateStats(processingTime: number): void {
    const totalTime = this.stats.averageResponseTime * (this.stats.totalRequests - 1) + processingTime;
    this.stats.averageResponseTime = totalTime / this.stats.totalRequests;
  }

  // Public methods for monitoring and control
  getStats(): ParserStats {
    return { ...this.stats };
  }

  clearCache(): void {
    this.cache.clear();
    console.log('📱 PHI2 PARSER: Cache cleared');
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/tags`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/tags`);
      return response.data.models.map((model: any) => model.name);
    } catch (error) {
      return [];
    }
  }

  setModel(model: string): void {
    this.model = model;
    console.log(`📱 PHI2 PARSER: Model changed to ${model}`);
  }

  setOllamaUrl(url: string): void {
    this.ollamaUrl = url;
    console.log(`📱 PHI2 PARSER: Ollama URL changed to ${url}`);
  }
} 