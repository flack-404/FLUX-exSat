// config.ts
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // RPC endpoint
  rpcUrl: process.env.RPC_URL,
  
  // Contract address
  payrollContractAddress: process.env.CONTRACT_ADDRESS || '',
  
  // Agent wallet private key
  privateKey: process.env.AGENT_PRIVATE_KEY || '',
  
  // Webhook URL
  webhookUrl: process.env.WEBHOOK_URL || '',
  
  // Low balance threshold
  lowBalanceThreshold: process.env.LOW_BALANCE_THRESHOLD || '0.1',
  
  // Other settings
  checkInterval: parseInt(process.env.CHECK_INTERVAL || '60'),
  retryLimit: parseInt(process.env.RETRY_LIMIT || '3'),
  gasLimitBuffer: parseFloat(process.env.GAS_LIMIT_BUFFER || '1.2'),
  batchProcessingThreshold: parseInt(process.env.BATCH_PROCESSING_THRESHOLD || '3'),
};