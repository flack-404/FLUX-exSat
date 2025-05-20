// components/LiquidityPositions.tsx
"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useTransaction } from "wagmi";
import { formatEther } from "viem";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLiquidityContract } from "@/lib/liquidityContract";

// Define types for position data
interface Position {
  id: string;
  poolId: string;
  amount: bigint;
  depositTime: bigint;
  lockPeriod: bigint;
  pendingRewards: bigint;
}

export function LiquidityPositions() {
  const { address } = useAccount();
  const [expandedPosition, setExpandedPosition] = useState<string | null>(null);
  const [withdrawingPositionId, setWithdrawingPositionId] = useState<string | null>(null);
  const [harvestingPositionId, setHarvestingPositionId] = useState<string | null>(null);

  // Fetch user's active positions
  const { data: positions, isLoading, refetch } = useReadContract({
    ...getLiquidityContract(),
    functionName: "getUserActivePositions",
    args: [address as `0x${string}` | undefined],
    query: {
      enabled: !!address,
    }
  });

  const toggleExpand = (id: string) => {
    setExpandedPosition(expandedPosition === id ? null : id);
  };

  // Setup contract writes
  const { writeContract: withdraw, data: withdrawData } = useWriteContract();
  const { writeContract: harvest, data: harvestData } = useWriteContract();
  
  // Setup transaction status
  const { isLoading: isWithdrawing, isSuccess: withdrawSuccess } = useTransaction({
    hash: withdrawData,
  });

  const { isLoading: isHarvesting, isSuccess: harvestSuccess } = useTransaction({
    hash: harvestData,
  });
  
  // Handle success with useEffect instead of callback
  useEffect(() => {
    if (withdrawSuccess) {
      setWithdrawingPositionId(null);
      refetch();
    }
  }, [withdrawSuccess, refetch]);

  useEffect(() => {
    if (harvestSuccess) {
      setHarvestingPositionId(null);
      refetch();
    }
  }, [harvestSuccess, refetch]);

  // Handle withdrawal
  const handleWithdraw = async (positionId: string) => {
    setWithdrawingPositionId(positionId);
    withdraw({
      ...getLiquidityContract(),
      functionName: "withdrawFromLiquidityPool",
      args: [positionId]
    });
  };

  // Handle harvest
  const handleHarvest = async (positionId: string) => {
    setHarvestingPositionId(positionId);
    harvest({
      ...getLiquidityContract(),
      functionName: "harvestYield",
      args: [positionId]
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm h-full">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6">
            Your Liquidity Positions
          </h2>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse h-24 bg-zinc-800/60 rounded-xl"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const positionsArray = positions as Position[] || [];

  if (!positionsArray || positionsArray.length === 0) {
    return (
      <Card className="bg-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm h-full hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6 flex items-center gap-2">
            Your Liquidity Positions
          </h2>
          
          <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
            <Droplet className="h-12 w-12 text-zinc-700 mb-4" />
            <h3 className="text-lg font-medium text-zinc-400">No Active Liquidity Positions</h3>
            <p className="text-sm text-zinc-500 mt-2 max-w-md">
              Start earning yields by depositing your idle funds into liquidity pools.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatLockPeriod = (lockPeriod: bigint) => {
    const seconds = Number(lockPeriod);
    if (seconds === 0) return "None";
    if (seconds === 604800) return "7 days";
    if (seconds === 2592000) return "30 days";
    if (seconds === 7776000) return "90 days";
    return `${Math.floor(seconds / 86400)} days`;
  };

  return (
    <Card className="bg-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm h-full hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6 flex items-center gap-2">
          Your Liquidity Positions
          <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-normal flex items-center">
            {positionsArray.length} Active
          </span>
        </h2>
        
        <div className="space-y-4">
          {positionsArray.map((position: Position, index: number) => {
            // Check if position is currently being withdrawn
            const isCurrentlyWithdrawing = withdrawingPositionId === position.id && isWithdrawing;
            const isCurrentlyHarvesting = harvestingPositionId === position.id && isHarvesting;
            
            // Check if position is locked
            const lockSeconds = Number(position.lockPeriod);
            const depositTime = Number(position.depositTime);
            const now = Math.floor(Date.now() / 1000);
            const isLocked = lockSeconds > 0 && now < depositTime + lockSeconds;
            const unlockDate = isLocked 
              ? new Date((depositTime + lockSeconds) * 1000).toLocaleDateString() 
              : null;

            return (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-zinc-700/50 overflow-hidden bg-zinc-800/60"
              >
                {/* Position Header */}
                <div 
                  className="p-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-4 cursor-pointer hover:bg-zinc-700/30 transition-colors"
                  onClick={() => toggleExpand(position.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Droplet className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{position.poolId}</div>
                      <div className="text-xs text-zinc-400">
                        {formatLockPeriod(position.lockPeriod)} Lock
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">Deposited</div>
                      <div className="font-medium">{formatEther(position.amount)} BTC</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">Earned</div>
                      <div className="font-medium text-emerald-400">
                        {formatEther(position.pendingRewards)} BTC
                      </div>
                    </div>
                    <div>
                      {expandedPosition === position.id ? (
                        <ChevronUp className="h-5 w-5 text-zinc-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-zinc-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedPosition === position.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-zinc-700/50 p-4 bg-zinc-800/80">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-zinc-500">Deposit Date</div>
                            <div className="text-sm">
                              {new Date(Number(position.depositTime) * 1000).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-zinc-500">Lock Period</div>
                            <div className="text-sm">{formatLockPeriod(position.lockPeriod)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-zinc-500">Position ID</div>
                            <div className="text-sm text-zinc-400 truncate" title={position.id}>
                              {position.id.length > 10 ? `${position.id.substring(0, 10)}...` : position.id}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-zinc-500">Status</div>
                            <div className="text-sm text-emerald-400">
                              {isLocked ? 'Locked' : 'Unlocked'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          <Button
                            onClick={() => handleHarvest(position.id)}
                            disabled={Number(position.pendingRewards) <= 0 || isCurrentlyHarvesting || isCurrentlyWithdrawing}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            size="sm"
                          >
                            {isCurrentlyHarvesting ? (
                              <>
                                <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                                Harvesting...
                              </>
                            ) : (
                              'Harvest Yield'
                            )}
                          </Button>
                          
                          <Button
                            onClick={() => handleWithdraw(position.id)}
                            disabled={isLocked || isCurrentlyWithdrawing || isCurrentlyHarvesting}
                            className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            size="sm"
                          >
                            {isCurrentlyWithdrawing ? (
                              <>
                                <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                                Withdrawing...
                              </>
                            ) : (
                              'Withdraw'
                            )}
                          </Button>
                          
                          {isLocked && (
                            <div className="flex items-center gap-2 text-xs text-yellow-400">
                              <AlertCircle className="h-3 w-3" />
                              <span>Locked until {unlockDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}