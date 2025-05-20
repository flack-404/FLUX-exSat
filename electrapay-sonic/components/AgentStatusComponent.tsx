"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ActivitySquare, 
  Wallet, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowDownUp, 
  RefreshCw, 
  Zap 
} from "lucide-react";
import { motion } from "framer-motion";

type AgentStatus = {
  isRunning: boolean;
  lastCheck: string | null;
  walletBalance: string;
  contractBalance: string;
  pendingPayments: number;
  processedPayments24h: number;
  failedPayments24h: number;
  nextScheduledPayment: {
    id: string;
    timeUntil: string;
    amount: string;
  } | null;
};

export function AgentStatusComponent() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    isRunning: true,
    lastCheck: new Date().toISOString(),
    walletBalance: "0.548",
    contractBalance: "2.341",
    pendingPayments: 3,
    processedPayments24h: 12,
    failedPayments24h: 0,
    nextScheduledPayment: {
      id: "15",
      timeUntil: "42 minutes",
      amount: "0.25 BTC"
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real implementation, this would fetch from your backend
  useEffect(() => {
    const fetchAgentStatus = async () => {
      try {
        setLoading(true);
        // In a real implementation, fetch from an API
        // const response = await fetch('/api/agent-status');
        // const data = await response.json();
        // setAgentStatus(data);
        
        // Simulate API call with a delay
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (err) {
        setError("Failed to load agent status");
        setLoading(false);
      }
    };
    
    fetchAgentStatus();
    
    // Poll for status updates every minute
    const intervalId = setInterval(fetchAgentStatus, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    // In a real implementation, this would trigger a new fetch
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  if (loading && !agentStatus.isRunning) {
    return (
      <Card className="bg-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-400" />
              Payment Agent Status
            </h2>
            <button 
              onClick={handleRefresh}
              className="p-2 rounded-lg hover:bg-zinc-700/50 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 text-zinc-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="flex justify-center items-center p-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-emerald-400">Loading agent status...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-zinc-800/40 border border-red-700/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-400" />
              Payment Agent Status
            </h2>
            <button 
              onClick={handleRefresh}
              className="p-2 rounded-lg hover:bg-zinc-700/50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 text-zinc-400" />
            </button>
          </div>
          
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent flex items-center gap-2">
            <Zap className="h-5 w-5 text-emerald-400" />
            Payment Agent Status
            <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-normal">
              Active
            </span>
          </h2>
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-zinc-700/50 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 text-zinc-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <ActivitySquare className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-medium text-zinc-300">Agent Status</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-emerald-400">Running</span>
            </div>
            {agentStatus.lastCheck && (
              <p className="text-xs text-zinc-500 mt-2">
                Last check: {new Date(agentStatus.lastCheck).toLocaleTimeString()}
              </p>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-medium text-zinc-300">Balances</h3>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-zinc-500">Agent:</span>
                <span className="text-zinc-300">{agentStatus.walletBalance} BTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-zinc-500">Contract:</span>
                <span className="text-zinc-300">{agentStatus.contractBalance} BTC</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownUp className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-medium text-zinc-300">Payment Activity</h3>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-zinc-500">Pending:</span>
                <span className="text-zinc-300">{agentStatus.pendingPayments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-zinc-500">Processed (24h):</span>
                <span className="text-zinc-300">{agentStatus.processedPayments24h}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-zinc-500">Failed (24h):</span>
                <span className={agentStatus.failedPayments24h > 0 ? "text-red-400" : "text-zinc-300"}>
                  {agentStatus.failedPayments24h}
                </span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-medium text-zinc-300">Next Payment</h3>
            </div>
            {agentStatus.nextScheduledPayment ? (
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-500">ID:</span>
                  <span className="text-zinc-300">#{agentStatus.nextScheduledPayment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-500">Due in:</span>
                  <span className="text-emerald-400">{agentStatus.nextScheduledPayment.timeUntil}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-500">Amount:</span>
                  <span className="text-zinc-300">{agentStatus.nextScheduledPayment.amount}</span>
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">No upcoming payments</p>
            )}
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mt-4 bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2"
        >
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Payment agent is running smoothly</p>
            <p className="text-zinc-400 text-xs mt-1">
              Recurring payments are being monitored and will be processed automatically when they're due.
            </p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}