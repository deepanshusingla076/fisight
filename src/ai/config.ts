/**
 * config for fisight financial advisor AI system
 * 
 * handles:
 * 1. fi money MCP server integration
 * 2. pre-trained model weights loading
 * 3. AI model params and settings
 */

export interface FiSightAIConfig {
  // MCP server configuration
  mcpServer: {
    enabled: boolean;
    serverPath: string;
    serverArgs: string[];
    capabilities: {
      resources: boolean;
      tools: boolean;
      prompts: boolean;
    };
  };

  // Pre-trained Model Configuration
  preTrainedModel: {
    enabled: boolean;
    weightsPath: string;
    modelType: 'tensorflow' | 'pytorch' | 'onnx';
    architecture: 'lstm' | 'transformer' | 'gru' | 'hybrid';
    inputDimensions: number;
    outputDimensions: number;
    normalizationParams?: {
      mean: number[];
      std: number[];
      min: number[];
      max: number[];
    };
    modelMetadata?: {
      version: string;
      trainedOn: string;
      accuracy: number;
      description: string;
    };
  };

  // Financial Data Processing
  dataProcessing: {
    transactionWindow: number; // Days to look back for transactions
    updateFrequency: number;   // Minutes between data updates
    riskThresholds: {
      low: number;
      medium: number;
      high: number;
    };
    healthScoreWeights: {
      emergencyFund: number;
      savingsRate: number;
      debtToIncome: number;
      investmentDiversity: number;
    };
  };

  // AI Model Settings
  aiSettings: {
    temperature: number;
    maxTokens: number;
    fallbackToGenkit: boolean;
    responseFormat: 'structured' | 'conversational' | 'hybrid';
    contextWindow: number; // Number of previous interactions to consider
  };
}

// Default configuration
export const defaultConfig: FiSightAIConfig = {
  mcpServer: {
    enabled: false, // Set to true when you have Fi Money MCP server set up
    serverPath: 'node', // Path to your MCP server executable
    serverArgs: ['path/to/fi-money-mcp-server.js'], // Arguments for the server
    capabilities: {
      resources: true,
      tools: true,
      prompts: true,
    },
  },

  preTrainedModel: {
    enabled: false, // Set to true when you want to use your .h5 weights
    weightsPath: '', // Path to your .h5 model file
    modelType: 'tensorflow',
    architecture: 'lstm', // Adjust based on your model
    inputDimensions: 10, // Adjust based on your model's input layer
    outputDimensions: 5,  // Adjust based on your model's output layer
    normalizationParams: {
      // These should match the normalization used during training
      mean: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      std: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      min: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      max: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    },
    modelMetadata: {
      version: '1.0.0',
      trainedOn: '2024-01-01',
      accuracy: 0.85,
      description: 'Financial advisory model trained on user behavior patterns',
    },
  },

  dataProcessing: {
    transactionWindow: 30,
    updateFrequency: 15,
    riskThresholds: {
      low: 0.3,
      medium: 0.6,
      high: 0.8,
    },
    healthScoreWeights: {
      emergencyFund: 0.3,
      savingsRate: 0.25,
      debtToIncome: 0.25,
      investmentDiversity: 0.2,
    },
  },

  aiSettings: {
    temperature: 0.7,
    maxTokens: 2000,
    fallbackToGenkit: true,
    responseFormat: 'structured',
    contextWindow: 5,
  },
};

// Environment-specific configurations
export const environments = {
  development: {
    ...defaultConfig,
    mcpServer: {
      ...defaultConfig.mcpServer,
      serverPath: 'npm',
      serverArgs: ['run', 'mcp-server:dev'],
    },
    aiSettings: {
      ...defaultConfig.aiSettings,
      temperature: 0.8, // More creative in development
    },
  },

  production: {
    ...defaultConfig,
    mcpServer: {
      ...defaultConfig.mcpServer,
      enabled: true,
      serverPath: 'node',
      serverArgs: ['dist/mcp-server.js'],
    },
    preTrainedModel: {
      ...defaultConfig.preTrainedModel,
      enabled: true,
    },
    aiSettings: {
      ...defaultConfig.aiSettings,
      temperature: 0.6, // More conservative in production
    },
  },
};

// Get configuration based on environment
export function getConfig(): FiSightAIConfig {
  const env = process.env.NODE_ENV || 'development';
  
  // Load custom config from environment variables if available
  const customConfig: Partial<FiSightAIConfig> = {};
  
  if (process.env.FISIGHT_PRETRAINED_MODEL_PATH) {
    customConfig.preTrainedModel = {
      ...defaultConfig.preTrainedModel,
      enabled: true,
      weightsPath: process.env.FISIGHT_PRETRAINED_MODEL_PATH,
    };
  }
  
  if (process.env.FISIGHT_MCP_SERVER_PATH) {
    customConfig.mcpServer = {
      ...defaultConfig.mcpServer,
      enabled: true,
      serverPath: process.env.FISIGHT_MCP_SERVER_PATH,
      serverArgs: process.env.FISIGHT_MCP_SERVER_ARGS?.split(',') || [],
    };
  }

  const envConfig = environments[env as keyof typeof environments] || defaultConfig;
  
  return {
    ...envConfig,
    ...customConfig,
  };
}

// Validation function for configuration
export function validateConfig(config: FiSightAIConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate MCP server configuration
  if (config.mcpServer.enabled) {
    if (!config.mcpServer.serverPath) {
      errors.push('MCP server path is required when MCP is enabled');
    }
    if (!config.mcpServer.serverArgs || config.mcpServer.serverArgs.length === 0) {
      errors.push('MCP server arguments are required when MCP is enabled');
    }
  }

  // Validate pre-trained model configuration
  if (config.preTrainedModel.enabled) {
    if (!config.preTrainedModel.weightsPath) {
      errors.push('Pre-trained model weights path is required when model is enabled');
    }
    if (config.preTrainedModel.inputDimensions <= 0) {
      errors.push('Input dimensions must be positive');
    }
    if (config.preTrainedModel.outputDimensions <= 0) {
      errors.push('Output dimensions must be positive');
    }
  }

  // Validate AI settings
  if (config.aiSettings.temperature < 0 || config.aiSettings.temperature > 2) {
    errors.push('Temperature must be between 0 and 2');
  }
  if (config.aiSettings.maxTokens <= 0) {
    errors.push('Max tokens must be positive');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
