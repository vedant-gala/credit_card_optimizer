import type { Request, Response } from 'express';
import { createError } from '@/middleware/error.middleware';
import { HybridSMSParserService } from '@/services/hybrid-sms-parser.service';

// Configure Hybrid SMS Parser with environment variables
const hybridSMSParser = new HybridSMSParserService({
  ollamaUrl: 'http://localhost:11434',
  model: 'phi',
  useLLM: true,
  llmConfidenceThreshold: 0.8,
  enableCaching: true,
  fallbackToRegex: true
  /*
  ollamaUrl: process.env['OLLAMA_URL'] || 'http://localhost:11434',
  model: process.env['OLLAMA_MODEL'] || 'phi',
  useLLM: process.env['USE_LLM_SMS_PARSING'] === 'true',
  llmConfidenceThreshold: parseFloat(process.env['LLM_CONFIDENCE_THRESHOLD'] || '0.8'),
  enableCaching: process.env['ENABLE_SMS_CACHING'] !== 'false',
  fallbackToRegex: process.env['FALLBACK_TO_REGEX'] !== 'false'
  */
});

export const hybridSMSController = {
  async parseSMS(req: Request, res: Response) {
    const requestId = req.headers['x-request-id'];
    console.log(`📱 [${requestId}] 🔄 HYBRID SMS CONTROLLER: Parsing SMS with hybrid parser`);

    try {
      const { message, sender } = req.body;

      if (!message || !sender) {
        throw createError('Message and sender are required', 400);
      }

      console.log(`📱 [${requestId}] 📨 HYBRID SMS CONTROLLER: Processing SMS from ${sender}`);
      console.log(`📱 [${requestId}] 📨 HYBRID SMS CONTROLLER: Message: ${message}`);

      const result = await hybridSMSParser.parseSMS(message, sender);
      
      console.log(`📱 [${requestId}] ✅ HYBRID SMS CONTROLLER: SMS parsed successfully`);
      console.log(`📱 [${requestId}] 📊 HYBRID SMS CONTROLLER: Confidence: ${result.confidence.toString()}, Pattern: ${result.pattern}`);

      return res.status(200).json({
        success: true,
        message: 'SMS parsed successfully with hybrid parser',
        data: result
      });
    } catch (error: any) {
      console.error(`📱 [${requestId}] 💥 HYBRID SMS CONTROLLER: Error parsing SMS:`, error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to parse SMS'
      });
    }
  },

  async testParsing(req: Request, res: Response) {
    const requestId = req.headers['x-request-id'];
    console.log(`📱 [${requestId}] 🔄 HYBRID SMS CONTROLLER: Testing SMS parsing`);

    try {
      const { message, sender } = req.body;

      if (!message || !sender) {
        throw createError('Message and sender are required', 400);
      }

      console.log(`📱 [${requestId}] 🧪 HYBRID SMS CONTROLLER: Testing SMS parsing for ${sender}`);

      const testResult = await hybridSMSParser.testParsing(message, sender);
      
      console.log(`📱 [${requestId}] ✅ HYBRID SMS CONTROLLER: Test completed`);
      console.log(`📱 [${requestId}] 📊 HYBRID SMS CONTROLLER: Method used: ${testResult.method}, Time: ${testResult.processingTime.toString()}ms`);

      return res.status(200).json({
        success: true,
        message: 'SMS parsing test completed',
        data: testResult
      });
    } catch (error: any) {
      console.error(`📱 [${requestId}] 💥 HYBRID SMS CONTROLLER: Error testing SMS parsing:`, error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to test SMS parsing'
      });
    }
  },

  async getStats(req: Request, res: Response) {
    const requestId = req.headers['x-request-id'];
    console.log(`📱 [${requestId}] 🔄 HYBRID SMS CONTROLLER: Getting parser statistics`);

    try {
      const stats = hybridSMSParser.getStats();
      
      console.log(`📱 [${requestId}] ✅ HYBRID SMS CONTROLLER: Statistics retrieved`);
      console.log(`📱 [${requestId}] 📊 HYBRID SMS CONTROLLER: Total requests: ${stats.totalRequests.toString()}, LLM success rate: ${stats.llmSuccessRate.toString()}`);

      return res.status(200).json({
        success: true,
        message: 'Parser statistics retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      console.error(`📱 [${requestId}] 💥 HYBRID SMS CONTROLLER: Error getting stats:`, error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get statistics'
      });
    }
  },

  async getDetailedStats(req: Request, res: Response) {
    const requestId = req.headers['x-request-id'];
    console.log(`📱 [${requestId}] 🔄 HYBRID SMS CONTROLLER: Getting detailed statistics`);

    try {
      const detailedStats = await hybridSMSParser.getDetailedStats();
      
      console.log(`📱 [${requestId}] ✅ HYBRID SMS CONTROLLER: Detailed statistics retrieved`);
      console.log(`📱 [${requestId}] 📊 HYBRID SMS CONTROLLER: Connection status: ${detailedStats.connectionStatus}`);

      return res.status(200).json({
        success: true,
        message: 'Detailed parser statistics retrieved successfully',
        data: detailedStats
      });
    } catch (error: any) {
      console.error(`📱 [${requestId}] 💥 HYBRID SMS CONTROLLER: Error getting detailed stats:`, error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get detailed statistics'
      });
    }
  },

  async getConfig(req: Request, res: Response) {
    const requestId = req.headers['x-request-id'];
    console.log(`📱 [${requestId}] 🔄 HYBRID SMS CONTROLLER: Getting parser configuration`);

    try {
      const config = hybridSMSParser.getConfig();
      
      console.log(`📱 [${requestId}] ✅ HYBRID SMS CONTROLLER: Configuration retrieved`);

      return res.status(200).json({
        success: true,
        message: 'Parser configuration retrieved successfully',
        data: config
      });
    } catch (error: any) {
      console.error(`📱 [${requestId}] 💥 HYBRID SMS CONTROLLER: Error getting config:`, error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get configuration'
      });
    }
  },

  async updateConfig(req: Request, res: Response) {
    const requestId = req.headers['x-request-id'];
    console.log(`📱 [${requestId}] 🔄 HYBRID SMS CONTROLLER: Updating parser configuration`);

    try {
      const config = req.body;

      if (!config || typeof config !== 'object') {
        throw createError('Valid configuration object is required', 400);
      }

      hybridSMSParser.setConfig(config);
      
      console.log(`📱 [${requestId}] ✅ HYBRID SMS CONTROLLER: Configuration updated`);
      console.log(`📱 [${requestId}] ⚙️ HYBRID SMS CONTROLLER: New config:`, config);

      return res.status(200).json({
        success: true,
        message: 'Parser configuration updated successfully',
        data: hybridSMSParser.getConfig()
      });
    } catch (error: any) {
      console.error(`📱 [${requestId}] 💥 HYBRID SMS CONTROLLER: Error updating config:`, error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update configuration'
      });
    }
  },

  async enableLLM(req: Request, res: Response) {
    const requestId = req.headers['x-request-id'];
    console.log(`📱 [${requestId}] 🔄 HYBRID SMS CONTROLLER: Enabling LLM parsing`);

    try {
      hybridSMSParser.enableLLM();
      
      console.log(`📱 [${requestId}] ✅ HYBRID SMS CONTROLLER: LLM parsing enabled`);

      return res.status(200).json({
        success: true,
        message: 'LLM parsing enabled successfully',
        data: hybridSMSParser.getConfig()
      });
    } catch (error: any) {
      console.error(`📱 [${requestId}] 💥 HYBRID SMS CONTROLLER: Error enabling LLM:`, error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to enable LLM parsing'
      });
    }
  },

  async disableLLM(req: Request, res: Response) {
    const requestId = req.headers['x-request-id'];
    console.log(`📱 [${requestId}] 🔄 HYBRID SMS CONTROLLER: Disabling LLM parsing`);

    try {
      hybridSMSParser.disableLLM();
      
      console.log(`📱 [${requestId}] ✅ HYBRID SMS CONTROLLER: LLM parsing disabled`);

      return res.status(200).json({
        success: true,
        message: 'LLM parsing disabled successfully',
        data: hybridSMSParser.getConfig()
      });
    } catch (error: any) {
      console.error(`📱 [${requestId}] 💥 HYBRID SMS CONTROLLER: Error disabling LLM:`, error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to disable LLM parsing'
      });
    }
  },

  async setConfidenceThreshold(req: Request, res: Response) {
    const requestId = req.headers['x-request-id'];
    console.log(`📱 [${requestId}] 🔄 HYBRID SMS CONTROLLER: Setting confidence threshold`);

    try {
      const { threshold } = req.body;

      if (typeof threshold !== 'number' || threshold < 0 || threshold > 1) {
        throw createError('Confidence threshold must be a number between 0 and 1', 400);
      }

      hybridSMSParser.setConfidenceThreshold(threshold);
      
      console.log(`📱 [${requestId}] ✅ HYBRID SMS CONTROLLER: Confidence threshold set to ${threshold.toString()}`);

      return res.status(200).json({
        success: true,
        message: 'Confidence threshold updated successfully',
        data: { threshold, config: hybridSMSParser.getConfig() }
      });
    } catch (error: any) {
      console.error(`📱 [${requestId}] 💥 HYBRID SMS CONTROLLER: Error setting confidence threshold:`, error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to set confidence threshold'
      });
    }
  },

  async clearCache(req: Request, res: Response) {
    const requestId = req.headers['x-request-id'];
    console.log(`📱 [${requestId}] 🔄 HYBRID SMS CONTROLLER: Clearing parser cache`);

    try {
      hybridSMSParser.clearCache();
      
      console.log(`📱 [${requestId}] ✅ HYBRID SMS CONTROLLER: Cache cleared successfully`);

      return res.status(200).json({
        success: true,
        message: 'Parser cache cleared successfully'
      });
    } catch (error: any) {
      console.error(`📱 [${requestId}] 💥 HYBRID SMS CONTROLLER: Error clearing cache:`, error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to clear cache'
      });
    }
  },

  async testConnection(req: Request, res: Response) {
    const requestId = req.headers['x-request-id'];
    console.log(`📱 [${requestId}] 🔄 HYBRID SMS CONTROLLER: Testing LLM connection`);

    try {
      const isConnected = await hybridSMSParser.testLLMConnection();
      
      console.log(`📱 [${requestId}] ✅ HYBRID SMS CONTROLLER: Connection test completed`);
      console.log(`📱 [${requestId}] 📊 HYBRID SMS CONTROLLER: Connection status: ${isConnected}`);

      return res.status(200).json({
        success: true,
        message: 'LLM connection test completed',
        data: {
          connected: isConnected,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error: any) {
      console.error(`📱 [${requestId}] 💥 HYBRID SMS CONTROLLER: Error testing connection:`, error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to test connection'
      });
    }
  },

  async parseMultipleSMS(req: Request, res: Response) {
    const requestId = req.headers['x-request-id'];
    console.log(`📱 [${requestId}] 🔄 HYBRID SMS CONTROLLER: Parsing multiple SMS`);

    try {
      const { smsList } = req.body;

      if (!Array.isArray(smsList) || smsList.length === 0) {
        throw createError('Valid SMS list array is required', 400);
      }

      console.log(`📱 [${requestId}] 📨 HYBRID SMS CONTROLLER: Processing ${smsList.length} SMS messages`);

      const results = await hybridSMSParser.parseMultipleSMS(smsList);
      
      console.log(`📱 [${requestId}] ✅ HYBRID SMS CONTROLLER: Multiple SMS parsing completed`);
      console.log(`📱 [${requestId}] 📊 HYBRID SMS CONTROLLER: Successfully parsed ${results.length.toString()} messages`);

      return res.status(200).json({
        success: true,
        message: 'Multiple SMS parsed successfully',
        data: {
          total: smsList.length,
          parsed: results.length,
          results: results
        }
      });
    } catch (error: any) {
      console.error(`📱 [${requestId}] 💥 HYBRID SMS CONTROLLER: Error parsing multiple SMS:`, error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to parse multiple SMS'
      });
    }
  }
}; 