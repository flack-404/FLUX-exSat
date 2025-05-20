// agent/index.ts
import { PaymentAgent } from './PaymentAgent';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Starting FLUX Payment Agent...');
console.log(`Contract address: ${process.env.CONTRACT_ADDRESS}`);
console.log(`RPC URL: ${process.env.RPC_URL}`);

// Create and start the payment agent
const agent = new PaymentAgent();
agent.start();

// Log startup message
console.log('Payment Agent is running and monitoring payments');
console.log('Press Ctrl+C to stop the agent');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down Payment Agent...');
  process.exit(0);
});

// Run payment pattern analysis once a day at midnight
const ONE_DAY = 24 * 60 * 60 * 1000;
setTimeout(() => {
  agent.analyzePaymentPatterns();
  
  // Schedule daily analysis
  setInterval(() => {
    agent.analyzePaymentPatterns();
  }, ONE_DAY);
}, getMillisecondsUntilMidnight());

// Helper function to calculate milliseconds until midnight
function getMillisecondsUntilMidnight() {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0
  );
  return midnight.getTime() - now.getTime();
}