"use client";

import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { Card, CardContent } from "@/components/ui/card";
import { Droplet, TrendingUp, Clock, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { getLiquidityContract } from "@/lib/liquidityContract";
import { useReadContract } from "wagmi";

export function LiquidityStats() {
  const { address } = useAccount();
  
  // Use the new useReadContract hook without 'enabled' property
  const { data: userStats, isPending: isLoading } = useReadContract({
    ...getLiquidityContract(),
    functionName: "getUserStats",
    args: address ? [address] : undefined,
    // 'enabled' is not supported in the new hook API
    // The query will automatically be disabled if args is undefined
  });

  if (isLoading || !userStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="bg-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="animate-pulse h-20"></div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  // Ensure the returned values are properly typed
  const [
    totalDeposited, 
    totalActiveDeposits, 
    totalPositions, 
    activePositions, 
    totalPendingRewards
  ] = userStats as [bigint, bigint, bigint, bigint, bigint];

  // Create stats cards data
  const stats = [
    { 
      icon: Wallet, 
      title: "Total Value Deposited", 
      value: `${formatEther(totalActiveDeposits)} BTC`,
      trend: Number(activePositions) > 0 ? `${activePositions.toString()} active positions` : "No active positions",
      trendPositive: Number(activePositions) > 0,
      color: "emerald"
    },
    { 
      icon: TrendingUp, 
      title: "Total Yield Earned", 
      value: `${formatEther(totalPendingRewards).slice(0, 15)} BTC`,
      trend: "Pending rewards",
      trendPositive: true,
      color: "emerald"
    },
    { 
      icon: Droplet, 
      title: "Projected Monthly Yield", 
      value: `${(Number(formatEther(totalActiveDeposits)) * 0.08 / 12).toFixed(4)} BTC`,
      trend: "Based on ~8% APY",
      trendPositive: true,
      color: "emerald"
    },
    { 
      icon: Clock, 
      title: "Total Positions", 
      value: `${totalPositions.toString()} (${activePositions.toString()} active)`,
      trend: Number(totalPositions) > Number(activePositions) 
        ? `${(Number(totalPositions) - Number(activePositions)).toString()} closed` 
        : "All positions active",
      trendPositive: Number(totalPositions) === Number(activePositions),
      color: "emerald"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className={`bg-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-${stat.color}-500/10 hover:bg-zinc-800/60 hover:border-${stat.color}-500/30 group`}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <stat.icon className={`h-7 w-7 text-${stat.color}-500 mr-3 group-hover:scale-110 transition-all`} />
                  <div className={`absolute -inset-1 bg-${stat.color}-500/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                </div>
                <h2 className="text-xl font-semibold text-white">{stat.title}</h2>
              </div>
              <p className={`text-3xl font-bold bg-gradient-to-r from-white to-${stat.color}-300 bg-clip-text text-transparent`}>{stat.value}</p>
              <div className="mt-2 flex items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${stat.trendPositive ? `bg-${stat.color}-500/20 text-${stat.color}-400` : 'bg-red-500/20 text-red-400'} flex items-center`}>
                  {stat.trendPositive ? (
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}