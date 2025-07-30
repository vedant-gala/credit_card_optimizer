import type { Request, Response } from 'express';
import { createError } from '@/middleware/error.middleware';
import { SMSParserService } from '@/services/sms-parser.service';

const smsParserService = new SMSParserService();

export const smsController = {
  async parseSMS(req: Request, res: Response) {
    try {
      const { message, sender } = req.body;
      
      if (!message || !sender) {
        throw createError('Message and sender are required', 400);
      }

      console.log(`📱 SMS CONTROLLER: Parsing SMS from ${sender}`);
      console.log(`📱 SMS CONTROLLER: Message preview: ${message.substring(0, 100)}...`);

      const parsedData = await smsParserService.parseSMS(message, sender);
      
      console.log(`📱 SMS CONTROLLER: Successfully parsed SMS for ${parsedData.bank.name}`);
      
      res.json({
        success: true,
        message: 'SMS parsed successfully',
        data: parsedData
      });
    } catch (error: any) {
      console.error(`📱 SMS CONTROLLER: Error parsing SMS:`, error.message);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async validateSMS(req: Request, res: Response) {
    try {
      const { message, sender } = req.body;
      
      if (!message || !sender) {
        throw createError('Message and sender are required', 400);
      }

      console.log(`📱 SMS CONTROLLER: Validating SMS from ${sender}`);

      const validationResult = await smsParserService.validateSMS(message, sender);
      
      console.log(`📱 SMS CONTROLLER: Validation completed. Valid: ${validationResult.isValid}`);
      
      res.json({
        success: true,
        message: 'SMS validation completed',
        data: validationResult
      });
    } catch (error: any) {
      console.error(`📱 SMS CONTROLLER: Error validating SMS:`, error.message);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async getSupportedBanks(_req: Request, res: Response) {
    try {
      console.log(`📱 SMS CONTROLLER: Getting supported banks`);

      const banks = smsParserService.getSupportedBanks();
      
      console.log(`📱 SMS CONTROLLER: Found ${banks.length} supported banks`);
      
      res.json({
        success: true,
        message: 'Supported banks retrieved successfully',
        data: {
          banks,
          total: banks.length,
          countries: [...new Set(banks.map(bank => bank.country))]
        }
      });
    } catch (error: any) {
      console.error(`📱 SMS CONTROLLER: Error getting supported banks:`, error.message);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async getSupportedPatterns(_req: Request, res: Response) {
    try {
      console.log(`📱 SMS CONTROLLER: Getting supported patterns`);

      const patterns = smsParserService.getSupportedPatterns();
      
      console.log(`📱 SMS CONTROLLER: Found ${patterns.length} supported patterns`);
      
      res.json({
        success: true,
        message: 'Supported patterns retrieved successfully',
        data: {
          patterns,
          total: patterns.length,
          banks: [...new Set(patterns.map(pattern => pattern.bank))],
          countries: [...new Set(patterns.map(pattern => pattern.country))]
        }
      });
    } catch (error: any) {
      console.error(`📱 SMS CONTROLLER: Error getting supported patterns:`, error.message);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async getParsingStats(_req: Request, res: Response) {
    try {
      console.log(`📱 SMS CONTROLLER: Getting parsing statistics`);

      const stats = await smsParserService.getParsingStats();
      
      console.log(`📱 SMS CONTROLLER: Retrieved parsing statistics`);
      
      res.json({
        success: true,
        message: 'Parsing statistics retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      console.error(`📱 SMS CONTROLLER: Error getting parsing stats:`, error.message);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async testPattern(req: Request, res: Response) {
    try {
      const { message, patternId } = req.body;
      
      if (!message || !patternId) {
        throw createError('Message and patternId are required', 400);
      }

      console.log(`📱 SMS CONTROLLER: Testing pattern ${patternId}`);

      const patterns = smsParserService.getSupportedPatterns();
      const pattern = patterns.find(p => p.id === patternId);
      
      if (!pattern) {
        throw createError(`Pattern with ID '${patternId}' not found`, 404);
      }

      const match = message.match(pattern.regex);
      const isValid = match !== null;
      
      console.log(`📱 SMS CONTROLLER: Pattern test result: ${isValid ? 'MATCH' : 'NO MATCH'}`);
      
      res.json({
        success: true,
        message: 'Pattern test completed',
        data: {
          patternId,
          patternName: pattern.name,
          isValid,
          match: match ? Array.from(match) : null,
          example: pattern.example,
          confidence: pattern.confidence
        }
      });
    } catch (error: any) {
      console.error(`📱 SMS CONTROLLER: Error testing pattern:`, error.message);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}; 