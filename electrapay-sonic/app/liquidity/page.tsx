"use client";

import { useState, useEffect } from "react";
import { useAccount, useBalance, useContractRead } from "wagmi";
import { formatEther, parseEther } from "viem";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { getContract } from "@/lib/contract";
import { motion } from "framer-motion";

// Import our liquidity components
import { LiquidityDeposit } from "@/components/LiquidityDeposit";
import { LiquidityPositions } from "@/components/LiquidityPositions";
import { LiquidityStats } from "@/components/LiquidityStats";

export default function LiquidityPage() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get contract balance
  const { data: contractBalance } = useContractRead({
    ...getContract(),
    functionName: "getContractBalance",
    // Remove any polling/watching properties as they appear to be unsupported
  });

  if (!mounted) return null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black pt-36 px-4 sm:px-6 lg:px-8 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"
            style={{
              backgroundPosition: '0 0, 0 0',
              opacity: 0.15
            }}
          />
          
          {/* Glowing orbs */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-white/60 bg-clip-text text-transparent mb-2">
              Liquidity Provision
            </h1>
            <p className="text-zinc-400 max-w-3xl">
              Put your idle funds to work in liquidity pools. Earn yields while your funds wait for scheduled payments.
              The system will automatically withdraw your funds when payments need to be made.
            </p>
          </div>

          {/* Stats Cards */}
          <LiquidityStats />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Deposit Form */}
            <LiquidityDeposit contractBalance={contractBalance ? formatEther(contractBalance as bigint) : "0"} />
            
            {/* User Positions */}
            <LiquidityPositions />
          </div>
        </div>
      </div>
    </>
  );
}