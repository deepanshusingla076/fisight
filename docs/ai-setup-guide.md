# FiSight AI Financial Advisor Setup Guide

This guide will help you integrate your pre-trained .h5 model weights and Fi Money's MCP server with your FiSight application.

## 🚀 Quick Setup

### 1. Install Required Dependencies

First, install the necessary packages for AI model integration:

```bash
# Install TensorFlow.js for loading .h5 weights
npm install @tensorflow/tfjs-node

# Install MCP SDK for Fi Money integration
npm install @modelcontextprotocol/sdk

# Install additional AI utilities
npm install zod genkit
```

### 2. Configure Your Pre-trained Model

1. **Place your .h5 model file** in a secure location (e.g., `./models/financial-advisor-v1.h5`)

2. **Update the configuration** in `src/ai/config.ts`:

```typescript
export const myModelConfig: FiSightAIConfig = {
  preTrainedModel: {
    enabled: true,
    weightsPath: '/path/to/your/financial-advisor-v1.h5',
    modelType: 'tensorflow',
    architecture: 'lstm', // or 'transformer', 'gru', 'hybrid'
    inputDimensions: 10, // Match your model's input layer
    outputDimensions: 5,  // Match your model's output layer
    normalizationParams: {
      // Use the same normalization parameters from your training
      mean: [/* your training mean values */],
      std: [/* your training std values */],
      min: [/* your training min values */],
      max: [/* your training max values */],
    },
  },
  // ... other config
};
```

3. **Set environment variables** in your `.env.local`:

```env
# Path to your pre-trained model
FISIGHT_PRETRAINED_MODEL_PATH=/absolute/path/to/your/model.h5

# Fi Money MCP Server configuration
FISIGHT_MCP_SERVER_PATH=node
FISIGHT_MCP_SERVER_ARGS=path/to/fi-money-mcp-server.js

# Enable features
FISIGHT_ENABLE_PRETRAINED_MODEL=true
FISIGHT_ENABLE_MCP_SERVER=true
```

### 3. Set Up Fi Money MCP Server Integration

1. **Create an MCP server configuration** for Fi Money:

```typescript
// In your initialization code
import { initializeMcpService } from '@/ai/mcp-service';
import { getConfig } from '@/ai/config';

const config = getConfig();

if (config.mcpServer.enabled) {
  await initializeMcpService(
    {
      serverPath: config.mcpServer.serverPath,
      serverArgs: config.mcpServer.serverArgs,
      capabilities: config.mcpServer.capabilities,
    },
    config.preTrainedModel.enabled ? {
      weightsPath: config.preTrainedModel.weightsPath,
      modelArchitecture: config.preTrainedModel.architecture,
      inputDimensions: config.preTrainedModel.inputDimensions,
      outputDimensions: config.preTrainedModel.outputDimensions,
      normalizationParams: config.preTrainedModel.normalizationParams,
    } : undefined
  );
}
```

### 4. Update Your Landing Page

Add the new Financial Advisor Chat Widget to your landing page:

```typescript
// In src/components/landing/landing-page.tsx
import { FinancialAdvisorChatWidget } from '@/components/shared/financial-advisor-chat';

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* existing content */}
      <FinancialAdvisorChatWidget />
    </div>
  );
}
```

## 🧠 Model Integration Details

### Transfer Learning from Your Pre-trained Model

Your pre-trained .h5 weights can significantly speed up training and improve accuracy. Here's how the system uses them:

1. **Fast Inference**: Pre-trained weights are loaded directly for real-time financial advice
2. **Transfer Learning**: The model leverages your existing knowledge about financial patterns
3. **Fallback Strategy**: If the pre-trained model fails, the system falls back to Genkit's standard inference

### Model Input/Output Format

Make sure your model expects these inputs (adjust in `mcp-service.ts` if different):

```typescript
// Input features (normalized):
[
  currentBalance / 10000,    // Normalized balance
  monthlyIncome / 5000,      // Normalized income  
  monthlyExpenses / 5000,    // Normalized expenses
  investmentCount,           // Number of investments
  debtCount,                 // Number of debts
  savingsRate,              // Monthly savings rate
  transactionVolume,        // Recent transaction count
  riskTolerance,            // User's risk preference
  ageGroup,                 // Age category (0-1)
  experienceLevel,          // Financial experience (0-1)
]

// Output predictions:
[
  riskScore,                // Financial risk (0-1)
  spendingPattern,          // Spending behavior score (0-1)
  savingsPotential,         // Savings optimization score (0-1)
  investmentRecommendation, // Investment suggestion score (0-1)
  modelConfidence,          // Prediction confidence (0-1)
]
```

### Customizing for Your Model

If your model has different input/output dimensions, update these files:

1. **`src/ai/config.ts`**: Update `inputDimensions` and `outputDimensions`
2. **`src/ai/mcp-service.ts`**: Modify `preprocessFinancialData()` function
3. **`src/ai/flows/financial-advisor-chatbot.ts`**: Adjust the analysis logic

## 🔧 Advanced Configuration

### Custom Normalization

If your model uses custom normalization, update the preprocessing:

```typescript
// In src/ai/mcp-service.ts
private preprocessFinancialData(financialData: any): any {
  // Your custom preprocessing logic
  const features = [
    // Transform data according to your training preprocessing
    (financialData.currentBalance - yourMean[0]) / yourStd[0],
    // ... other features
  ];
  
  return tf.tensor2d([features]);
}
```

### Performance Optimization

1. **Model Caching**: Models are loaded once and cached for subsequent requests
2. **Batch Processing**: Multiple financial analyses can be batched together
3. **Memory Management**: TensorFlow.js tensors are properly disposed after use

### Error Handling

The system includes robust error handling:

- **Model Loading Failures**: Falls back to standard Genkit inference
- **MCP Connection Issues**: Continues with local data processing
- **Prediction Errors**: Provides graceful error messages to users

## 🧪 Testing Your Integration

### 1. Test Model Loading

```bash
# Run with your model enabled
npm run dev
```

Check the console for:
```
✅ Loading pre-trained model from: /path/to/your/model.h5
✅ Pre-trained model loaded successfully
✅ Successfully connected to Fi Money MCP server
```

### 2. Test Financial Advice

Open the chat widget and try these queries:
- "What's my current financial health score?"
- "Should I invest more or pay off debt?"
- "How can I improve my savings rate?"

### 3. Monitor Performance

The system logs performance metrics:
```
🧠 Using pre-trained model for analysis (confidence: 0.89)
⚡ MCP server response time: 234ms
📊 Financial health score calculated: 76/100
```

## 🚨 Troubleshooting

### Common Issues

1. **Model Loading Errors**:
   - Check file path and permissions
   - Ensure .h5 file is not corrupted
   - Verify TensorFlow.js installation

2. **MCP Connection Failures**:
   - Verify Fi Money server is running
   - Check network connectivity
   - Validate server configuration

3. **Performance Issues**:
   - Monitor memory usage with TensorFlow.js
   - Check model size and complexity
   - Consider model quantization for faster inference

### Debug Mode

Enable debug logging:

```env
# In .env.local
DEBUG=fisight:ai:*
NODE_ENV=development
```

This will provide detailed logs about:
- Model loading and inference
- MCP server communication
- Financial data processing
- User interaction tracking

## 🎯 Next Steps

1. **Train Incremental Updates**: Use user interactions to fine-tune your model
2. **A/B Testing**: Compare pre-trained model vs. standard Genkit responses
3. **Analytics**: Monitor financial advice accuracy and user satisfaction
4. **Scaling**: Consider deploying model inference to dedicated servers

## 📚 Additional Resources

- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Genkit Documentation](https://firebase.google.com/docs/genkit)
- [Financial Data Processing Best Practices](./financial-data-processing.md)

---

Your AI Financial Advisor is now ready to provide personalized, intelligent financial guidance using your pre-trained model! 🚀
