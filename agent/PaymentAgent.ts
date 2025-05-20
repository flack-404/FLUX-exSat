import { ethers } from 'ethers';
import cron from 'node-cron';
import axios from 'axios';
import { PAYROLL_ABI } from './abis/PayrollABI';
import { config } from './config';

/**
 * PaymentAgent
 * 
 * An automated system for monitoring and processing recurring payments
 * from the Payroll smart contract.
 */
export class PaymentAgent {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private payrollContract: ethers.Contract;
  private isProcessing: boolean = false;
  private retryQueue: Map<string, number> = new Map(); // paymentId -> retry count
  private MAX_RETRIES = 3;

  constructor() {
    // Initialize provider and wallet
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.wallet = new ethers.Wallet(
        config.privateKey.startsWith('0x') ? config.privateKey : `0x${config.privateKey}`, 
        this.provider   
    );
    // Initialize contract
    this.payrollContract = new ethers.Contract(
      config.payrollContractAddress,
      PAYROLL_ABI,
      this.wallet
    );
    
    console.log(`Payment Agent initialized with wallet ${this.wallet.address}`);
  }

  /**
   * Start the monitoring and processing schedule
   */
  public start(): void {
    console.log('Payment Agent started');
    
    // Check for payments every minute
    cron.schedule('* * * * *', async () => {
      await this.checkAndProcessPayments();
    });
    
    // Check wallet balances every hour to ensure sufficient funds for fees
    cron.schedule('0 * * * *', async () => {
      await this.checkBalance();
    });
    
    // Process retry queue every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await this.processRetryQueue();
    });
  }

  /**
   * Check and process payments that are due
   */
  private async checkAndProcessPayments(): Promise<void> {
    if (this.isProcessing) {
      console.log('Already processing payments, skipping check');
      return;
    }
    
    try {
      this.isProcessing = true;
      console.log('Checking for payments to process...');
      
      // Get all active payment IDs
      const activePaymentIds = await this.payrollContract.getActivePaymentIds();
      console.log(`Found ${activePaymentIds.length} active payments`);
      
      if (activePaymentIds.length === 0) {
        return;
      }
      
      // Payments that can be processed
      const processablePayments: Array<bigint> = [];
      
      // Check each payment
      for (const paymentId of activePaymentIds) {
        try {
          const canProcess = await this.payrollContract.canProcessPayment(paymentId);
          if (canProcess) {
            processablePayments.push(paymentId);
          } else {
            // Check why payment can't be processed for detailed logging
            const payment = await this.payrollContract.recurringPayments(paymentId);
            const nextPaymentTime = Number(payment.lastPayment) + Number(payment.interval);
            const now = Math.floor(Date.now() / 1000);
            
            if (!payment.isActive) {
              console.log(`Payment #${paymentId}: Inactive`);
            } else if (now < nextPaymentTime) {
              const timeUntilNext = nextPaymentTime - now;
              console.log(`Payment #${paymentId}: Not due yet (${timeUntilNext} seconds remaining)`);
            } else {
              console.log(`Payment #${paymentId}: Can't process - Likely insufficient balance`);
              
              // Send webhook notification for low balance if configured
              if (config.webhookUrl && now >= nextPaymentTime) {
                await this.sendWebhook({
                  type: 'warning',
                  title: 'Low Balance Alert',
                  message: `Payment #${paymentId} is due but cannot be processed due to insufficient balance.`,
                  paymentId: paymentId.toString(),
                  timestamp: new Date().toISOString()
                });
              }
            }
          }
        } catch (error) {
          console.error(`Error checking payment ${paymentId}:`, error);
        }
      }
      
      // Process payments if there are any ready
      if (processablePayments.length > 0) {
        console.log(`Processing ${processablePayments.length} payments: ${processablePayments.join(', ')}`);
        
        // Check if we should process payments individually or in a batch
        if (processablePayments.length > 3) {
          // Process in batch for gas efficiency
          await this.processBatchPayments(processablePayments);
        } else {
          // Process individually for better error handling
          for (const paymentId of processablePayments) {
            await this.processSinglePayment(paymentId);
          }
        }
      }
    } catch (error) {
      console.error('Error in checkAndProcessPayments:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process a single payment
   */
  private async processSinglePayment(paymentId: bigint): Promise<void> {
    try {
      console.log(`Processing payment #${paymentId}...`);
      
      // Get payment details for notification
      const payment = await this.payrollContract.recurringPayments(paymentId);
      
      // Send upcoming payment notification
      if (config.webhookUrl) {
        await this.sendWebhook({
          type: 'info',
          title: 'Processing Payment',
          message: `Payment #${paymentId} is being processed.`,
          paymentId: paymentId.toString(),
          recipient: payment.recipient,
          amount: ethers.formatEther(payment.amount),
          timestamp: new Date().toISOString()
        });
      }
      
      // Process the payment
      const tx = await this.payrollContract.processRecurringPayment(paymentId, {
        gasLimit: 3000000 // Ensure sufficient gas
      });
      
      console.log(`Transaction submitted: ${tx.hash}`);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log(`Payment #${paymentId} processed successfully in tx ${receipt?.hash}`);
      
      // Send success notification
      if (config.webhookUrl) {
        await this.sendWebhook({
          type: 'success',
          title: 'Payment Successful',
          message: `Payment #${paymentId} has been processed successfully.`,
          paymentId: paymentId.toString(),
          recipient: payment.recipient,
          amount: ethers.formatEther(payment.amount),
          transactionHash: tx.hash,
          timestamp: new Date().toISOString()
        });
      }
      
      // Remove from retry queue if it was there
      this.retryQueue.delete(paymentId.toString());
    } catch (error) {
      console.error(`Error processing payment #${paymentId}:`, error);
      
      // Add to retry queue if not already at max retries
      const currentRetries = this.retryQueue.get(paymentId.toString()) || 0;
      if (currentRetries < this.MAX_RETRIES) {
        this.retryQueue.set(paymentId.toString(), currentRetries + 1);
        console.log(`Added payment #${paymentId} to retry queue (attempt ${currentRetries + 1}/${this.MAX_RETRIES})`);
      } else {
        console.log(`Payment #${paymentId} failed after ${this.MAX_RETRIES} attempts`);
        
        // Send failure notification
        if (config.webhookUrl) {
          const payment = await this.payrollContract.recurringPayments(paymentId);
          await this.sendWebhook({
            type: 'error',
            title: 'Payment Failed',
            message: `Payment #${paymentId} could not be processed after multiple attempts.`,
            paymentId: paymentId.toString(),
            recipient: payment.recipient,
            amount: ethers.formatEther(payment.amount),
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
          });
        }
      }
    }
  }

  /**
   * Process payments in a batch for gas efficiency
   */
  private async processBatchPayments(paymentIds: Array<bigint>): Promise<void> {
    try {
      console.log(`Processing batch of ${paymentIds.length} payments...`);
      
      // Process all payments in a single transaction
      const tx = await this.payrollContract.processMultiplePayments(paymentIds, {
        gasLimit: 6000000 // Higher gas limit for batch processing
      });
      
      console.log(`Batch transaction submitted: ${tx.hash}`);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log(`Batch processed successfully in tx ${receipt?.hash}`);
      
      // Send batch success notification
      if (config.webhookUrl) {
        await this.sendWebhook({
          type: 'success',
          title: 'Batch Payments Processed',
          message: `Successfully processed ${paymentIds.length} payments in a batch.`,
          paymentIds: paymentIds.map(id => id.toString()),
          transactionHash: tx.hash,
          timestamp: new Date().toISOString()
        });
      }
      
      // Remove all processed payments from retry queue
      for (const paymentId of paymentIds) {
        this.retryQueue.delete(paymentId.toString());
      }
    } catch (error) {
      console.error('Error processing batch payments:', error);
      
      // Fall back to individual processing
      console.log('Falling back to individual payment processing...');
      for (const paymentId of paymentIds) {
        await this.processSinglePayment(paymentId);
      }
    }
  }

  /**
   * Process payments in the retry queue
   */
  private async processRetryQueue(): Promise<void> {
    if (this.retryQueue.size === 0) {
      return;
    }
    
    console.log(`Processing retry queue with ${this.retryQueue.size} payments`);
    
    for (const [paymentId, retryCount] of this.retryQueue.entries()) {
      try {
        console.log(`Retrying payment #${paymentId} (attempt ${retryCount}/${this.MAX_RETRIES})`);
        
        // Check if payment can still be processed
        const canProcess = await this.payrollContract.canProcessPayment(BigInt(paymentId));
        if (!canProcess) {
          console.log(`Payment #${paymentId} cannot be processed yet, keeping in retry queue`);
          continue;
        }
        
        // Process the payment
        const tx = await this.payrollContract.processRecurringPayment(BigInt(paymentId), {
          gasLimit: 3000000
        });
        
        console.log(`Retry transaction submitted: ${tx.hash}`);
        
        // Wait for confirmation
        const receipt = await tx.wait();
        console.log(`Payment #${paymentId} processed successfully in retry tx ${receipt?.hash}`);
        
        // Send success notification
        if (config.webhookUrl) {
          const payment = await this.payrollContract.recurringPayments(BigInt(paymentId));
          await this.sendWebhook({
            type: 'success',
            title: 'Retry Payment Successful',
            message: `Retry payment #${paymentId} has been processed successfully.`,
            paymentId: paymentId,
            recipient: payment.recipient,
            amount: ethers.formatEther(payment.amount),
            transactionHash: tx.hash,
            timestamp: new Date().toISOString()
          });
        }
        
        // Remove from retry queue
        this.retryQueue.delete(paymentId);
      } catch (error) {
        console.error(`Error retrying payment #${paymentId}:`, error);
        
        // Update retry count
        const newRetryCount = retryCount + 1;
        if (newRetryCount >= this.MAX_RETRIES) {
          console.log(`Payment #${paymentId} failed after ${this.MAX_RETRIES} attempts, removing from queue`);
          this.retryQueue.delete(paymentId);
          
          // Send failure notification
          if (config.webhookUrl) {
            const payment = await this.payrollContract.recurringPayments(BigInt(paymentId));
            await this.sendWebhook({
              type: 'error',
              title: 'Retry Payment Failed',
              message: `Payment #${paymentId} failed after ${this.MAX_RETRIES} retry attempts.`,
              paymentId: paymentId,
              recipient: payment.recipient,
              amount: ethers.formatEther(payment.amount),
              error: error instanceof Error ? error.message : String(error),
              timestamp: new Date().toISOString()
            });
          }
        } else {
          this.retryQueue.set(paymentId, newRetryCount);
        }
      }
    }
  }

  /**
   * Check wallet balance to ensure sufficient funds
   */
  private async checkBalance(): Promise<void> {
    try {
      console.log('Checking wallet balance...');
      
      // Check wallet ETH balance
      const walletBalance = await this.provider.getBalance(this.wallet.address);
      console.log(`Wallet balance: ${ethers.formatEther(walletBalance)} ETH`);
      
      // Check if wallet balance is getting low
      if (walletBalance < ethers.parseEther(config.lowBalanceThreshold)) {
        console.log('WARNING: Wallet balance is low');
        
        if (config.webhookUrl) {
          await this.sendWebhook({
            type: 'warning',
            title: 'Agent Wallet Low Balance',
            message: `The payment agent wallet balance is running low.`,
            walletAddress: this.wallet.address,
            balance: ethers.formatEther(walletBalance),
            threshold: config.lowBalanceThreshold,
            timestamp: new Date().toISOString()
          });
        }
      }
      
      // Check contract balance
      const contractBalance = await this.payrollContract.getContractBalance();
      console.log(`Contract balance: ${ethers.formatEther(contractBalance)} ETH`);
      
      // Get all active payments
      const activePaymentIds = await this.payrollContract.getActivePaymentIds();
      
      // Check balances for each payment
      for (const paymentId of activePaymentIds) {
        const payment = await this.payrollContract.recurringPayments(paymentId);
        
        // Check when the next payment is due
        const nextPaymentTime = Number(payment.lastPayment) + Number(payment.interval);
        const now = Math.floor(Date.now() / 1000);
        const timeUntilNext = nextPaymentTime - now;
        
        // If payment is due within the next 24 hours, check balance
        if (timeUntilNext <= 86400 && timeUntilNext > 0) {
          if (payment.amount > contractBalance) {
            console.log(`Payment #${paymentId} due in ${timeUntilNext} seconds but contract has insufficient balance`);
            
            // Send warning notification
            if (config.webhookUrl) {
              await this.sendWebhook({
                type: 'warning',
                title: 'Upcoming Payment - Insufficient Balance',
                message: `Payment #${paymentId} is due in ${Math.floor(timeUntilNext / 3600)} hours but the contract has insufficient balance.`,
                paymentId: paymentId.toString(),
                recipient: payment.recipient,
                amount: ethers.formatEther(payment.amount),
                contractBalance: ethers.formatEther(contractBalance),
                dueIn: `${Math.floor(timeUntilNext / 3600)} hours`,
                timestamp: new Date().toISOString()
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking balances:', error);
    }
  }

  /**
   * Send webhook notification
   */
  private async sendWebhook(data: any): Promise<void> {
    if (!config.webhookUrl) {
      return;
    }
    
    try {
      await axios.post(config.webhookUrl, data);
      console.log(`Webhook notification sent: ${data.title}`);
    } catch (error) {
      console.error('Error sending webhook notification:', error);
    }
  }

  /**
   * Analyze payment patterns
   */
  public async analyzePaymentPatterns(): Promise<void> {
    try {
      console.log('Analyzing payment patterns...');
      
      // Get all active payment IDs
      const activePaymentIds = await this.payrollContract.getActivePaymentIds();
      
      // Group payments by interval
      const paymentsByInterval: Record<string, Array<bigint>> = {};
      
      for (const paymentId of activePaymentIds) {
        const payment = await this.payrollContract.recurringPayments(paymentId);
        const interval = payment.interval.toString();
        
        if (!paymentsByInterval[interval]) {
          paymentsByInterval[interval] = [];
        }
        
        paymentsByInterval[interval].push(paymentId);
      }
      
      console.log('Payment patterns by interval:');
      for (const [interval, paymentIds] of Object.entries(paymentsByInterval)) {
        console.log(`- Interval ${interval} seconds: ${paymentIds.length} payments`);
      }
      
      // Identify optimal batch processing times
      for (const [interval, paymentIds] of Object.entries(paymentsByInterval)) {
        if (paymentIds.length > 3) {
          console.log(`Recommendation: Process interval ${interval} payments in batches for gas efficiency`);
        }
      }
    } catch (error) {
      console.error('Error analyzing payment patterns:', error);
    }
  }
}

// Script to start the agent
if (require.main === module) {
  const agent = new PaymentAgent();
  agent.start();
  
  // Run payment pattern analysis once a day
  cron.schedule('0 0 * * *', async () => {
    await agent.analyzePaymentPatterns();
  });
}