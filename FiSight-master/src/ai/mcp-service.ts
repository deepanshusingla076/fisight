/**
 * @fileOverview MCP Integration Service for Fi Money
 * 
 * This service handles integration with Fi Money's Model Context Protocol (MCP) server
 * and manages pre-trained model weights for faster financial advisory responses.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export interface McpConfig {
  serverPath: string;
  serverArgs: string[];
  capabilities?: {
    resources?: boolean;
    tools?: boolean;
    prompts?: boolean;
  };
}

export interface PreTrainedModelConfig {
  weightsPath: string;
  modelArchitecture: 'lstm' | 'transformer' | 'gru' | 'hybrid';
  inputDimensions: number;
  outputDimensions: number;
  normalizationParams?: {
    mean: number[];
    std: number[];
  };
}

export interface FinancialContext {
  userId: string;
  accountData: any;
  transactionHistory: any[];
  marketData?: any;
  userPreferences?: any;
}

export class FiMoneyMcpService {
  private client: Client | null = null;
  private isConnected = false;
  private preTrainedModel: any = null;

  constructor(
    private config: McpConfig,
    private modelConfig?: PreTrainedModelConfig
  ) {}

  /**
   * Initialize connection to Fi Money's MCP server
   */
  async initialize(): Promise<void> {
    try {
      const transport = new StdioClientTransport({
        command: this.config.serverPath,
        args: this.config.serverArgs,
      });

      this.client = new Client(
        {
          name: 'fisight-financial-advisor',
          version: '1.0.0',
        },
        {
          capabilities: this.config.capabilities || {
            resources: true,
            tools: true,
            prompts: true,
          },
        }
      );

      await this.client.connect(transport);
      this.isConnected = true;

      console.log('Successfully connected to Fi Money MCP server');

      // Load pre-trained model if configuration is provided
      if (this.modelConfig) {
        await this.loadPreTrainedModel();
      }
    } catch (error) {
      console.error('Failed to connect to Fi Money MCP server:', error);
      throw error;
    }
  }

  /**
   * Load pre-trained model weights for faster inference
   */
  private async loadPreTrainedModel(): Promise<void> {
    if (!this.modelConfig) {
      throw new Error('Model configuration not provided');
    }

    try {
      // For browser environment, we'll use the standard TensorFlow.js
      const tf = await import('@tensorflow/tfjs');
      
      console.log(`Loading pre-trained model from: ${this.modelConfig.weightsPath}`);
      
      // Load the model weights
      this.preTrainedModel = await tf.loadLayersModel(this.modelConfig.weightsPath);
      
      console.log('Pre-trained model loaded successfully');
      if (this.preTrainedModel.summary) {
        console.log('Model summary:', this.preTrainedModel.summary());
      }
    } catch (error) {
      console.error('Failed to load pre-trained model:', error);
      // Continue without pre-trained model - fallback to standard Genkit inference
      console.log('Continuing with standard inference without pre-trained weights');
    }
  }

  /**
   * Get financial data from Fi Money through MCP
   */
  async getFinancialData(userId: string): Promise<any> {
    if (!this.isConnected || !this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      // Use MCP to fetch user's financial data
      const response = await this.client.callTool({
        name: 'get_user_financial_data',
        arguments: { userId },
      });

      return response.content;
    } catch (error) {
      console.error('Failed to fetch financial data:', error);
      throw error;
    }
  }

  /**
   * Get real-time transaction data
   */
  async getRealtimeTransactions(userId: string, limit: number = 10): Promise<any[]> {
    if (!this.isConnected || !this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      const response = await this.client.callTool({
        name: 'get_realtime_transactions',
        arguments: { userId, limit },
      });

      return response.content as any[];
    } catch (error) {
      console.error('Failed to fetch realtime transactions:', error);
      throw error;
    }
  }

  /**
   * Analyze financial patterns using pre-trained model
   */
  async analyzeFinancialPatterns(financialData: any): Promise<any> {
    if (!this.preTrainedModel) {
      console.log('Pre-trained model not available, using standard analysis');
      return this.standardAnalysis(financialData);
    }

    try {
      // Prepare input data for the model
      const inputTensor = await this.preprocessFinancialData(financialData);
      
      // Run inference with pre-trained model
      const prediction = this.preTrainedModel.predict(inputTensor) as any;
      
      // Convert tensor to readable format
      const predictionArray = await prediction.data();
      
      // Clean up tensors to prevent memory leaks
      inputTensor.dispose();
      prediction.dispose();
      
      return {
        riskScore: predictionArray[0],
        spendingPattern: predictionArray[1],
        savingsPotential: predictionArray[2],
        investmentRecommendation: predictionArray[3],
        modelConfidence: predictionArray[4],
        usingPreTrainedModel: true,
      };
    } catch (error) {
      console.error('Pre-trained model analysis failed:', error);
      return this.standardAnalysis(financialData);
    }
  }

  /**
   * Preprocess financial data for model input
   */
  private async preprocessFinancialData(financialData: any): Promise<any> {
    // This would need to match your pre-trained model's expected input format
    const features = [
      financialData.currentBalance / 10000, // Normalize balance
      financialData.monthlyIncome / 5000,   // Normalize income
      financialData.monthlyExpenses / 5000, // Normalize expenses
      financialData.investments?.length || 0,
      financialData.debts?.length || 0,
      // Add more features based on your model's training data
    ];

    // Apply normalization if parameters are available
    if (this.modelConfig?.normalizationParams) {
      const { mean, std } = this.modelConfig.normalizationParams;
      features.forEach((value, index) => {
        if (mean[index] && std[index]) {
          features[index] = (value - mean[index]) / std[index];
        }
      });
    }

    // Convert to tensor using the imported TensorFlow.js
    const tf = await import('@tensorflow/tfjs');
    return tf.tensor2d([features]);
  }

  /**
   * Fallback analysis when pre-trained model is not available
   */
  private standardAnalysis(financialData: any): any {
    const { currentBalance, monthlyIncome, monthlyExpenses } = financialData;
    const netIncome = monthlyIncome - monthlyExpenses;
    const savingsRate = netIncome / monthlyIncome;

    return {
      riskScore: savingsRate < 0.1 ? 0.8 : 0.3,
      spendingPattern: monthlyExpenses / monthlyIncome,
      savingsPotential: Math.max(0, savingsRate),
      investmentRecommendation: currentBalance > monthlyExpenses * 6 ? 0.7 : 0.3,
      modelConfidence: 0.6,
      usingPreTrainedModel: false,
    };
  }

  /**
   * Store user interaction for continuous learning
   */
  async storeInteraction(userId: string, interaction: any): Promise<void> {
    if (!this.isConnected || !this.client) {
      console.log('MCP client not connected, storing locally');
      return;
    }

    try {
      await this.client.callTool({
        name: 'store_user_interaction',
        arguments: {
          userId,
          interaction: {
            ...interaction,
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      console.error('Failed to store interaction:', error);
    }
  }

  /**
   * Get market context data
   */
  async getMarketContext(): Promise<any> {
    if (!this.isConnected || !this.client) {
      return null;
    }

    try {
      const response = await this.client.callTool({
        name: 'get_market_data',
        arguments: {},
      });

      return response.content;
    } catch (error) {
      console.error('Failed to fetch market context:', error);
      return null;
    }
  }

  /**
   * Disconnect from MCP server
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('Disconnected from Fi Money MCP server');
    }
  }
}

// Singleton instance for the application
let mcpServiceInstance: FiMoneyMcpService | null = null;

/**
 * Get or create the MCP service instance
 */
export function getMcpService(config?: McpConfig, modelConfig?: PreTrainedModelConfig): FiMoneyMcpService {
  if (!mcpServiceInstance && config) {
    mcpServiceInstance = new FiMoneyMcpService(config, modelConfig);
  }
  
  if (!mcpServiceInstance) {
    throw new Error('MCP service not initialized. Please provide configuration.');
  }
  
  return mcpServiceInstance;
}

/**
 * Initialize the MCP service with your configuration
 */
export async function initializeMcpService(
  mcpConfig: McpConfig,
  modelConfig?: PreTrainedModelConfig
): Promise<FiMoneyMcpService> {
  const service = getMcpService(mcpConfig, modelConfig);
  await service.initialize();
  return service;
}
