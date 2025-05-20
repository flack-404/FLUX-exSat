"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplet, Wallet, ChevronDown, ChevronUp, Info, Lock, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import { getLiquidityContract } from "@/lib/liquidityContract";

// Define proper types for the pool data
interface Pool {
  id: string;
  name: string;
  apy: bigint;
  riskLevel: number;
}

// Define the contractBalance prop type
interface LiquidityDepositProps {
  contractBalance: string;
}

export function LiquidityDeposit({ contractBalance }: LiquidityDepositProps) {
  const { address } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedPool, setSelectedPool] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [lockPeriod, setLockPeriod] = useState("0");
  const [isDepositing, setIsDepositing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Fetch active pools from contract with useReadContract
  const { data: poolsData, isLoading: isLoadingPools } = useReadContract({
    ...getLiquidityContract(),
    functionName: "getActivePools",
  }) as { data: Pool[] | undefined, isLoading: boolean };

  // Convert undefined result to empty array
  const pools = poolsData || [];

  // Select first pool by default when pools are loaded
  useEffect(() => {
    if (pools && pools.length > 0 && !selectedPool) {
      setSelectedPool(pools[0].id);
    }
  }, [pools, selectedPool]);

  // Get selected pool data
  const selectedPoolData = pools?.find(pool => pool.id === selectedPool);

  // Use useWriteContract for transactions
  const { writeContractAsync } = useWriteContract();
  
  // Instead of using event watchers, we'll use a simpler approach with promises
  const handleDeposit = async () => {
    if (!writeContractAsync || !selectedPool) return;
    
    try {
      setIsDepositing(true);
      setIsSuccess(false);
      
      await writeContractAsync({
        ...getLiquidityContract(),
        functionName: "depositToLiquidityPool",
        args: [
          selectedPool,
          BigInt(lockPeriod)
        ],
        value: depositAmount ? parseEther(depositAmount) : BigInt(0)
      });
      
      // If the transaction was successful (didn't throw an error)
      setIsSuccess(true);
      setIsDepositing(false);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Deposit failed:", error);
      setIsDepositing(false);
    }
  };

  const maxAmount = parseFloat(contractBalance || "0");

  return (
    <Card className="bg-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm h-full hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6 flex items-center gap-2">
          Deposit to Liquidity Pool
          <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-sm font-normal flex items-center">
            <Droplet className="h-3 w-3 mr-1" />
            Earn Yield
          </span>
        </h2>

        <div className="space-y-6">
          {/* Pool Selection */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400 font-medium">Select Liquidity Pool</label>
            {isLoadingPools ? (
              <div className="animate-pulse h-12 bg-zinc-800/60 rounded-lg"></div>
            ) : (
              <Select value={selectedPool} onValueChange={setSelectedPool}>
                <SelectTrigger className="w-full py-6 bg-zinc-800/60 border-zinc-700/70 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50">
                  <SelectValue placeholder="Select a liquidity pool" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {pools?.map((pool: Pool) => (
                    <SelectItem key={pool.id} value={pool.id} className="focus:bg-emerald-500/20">
                      <div className="flex gap-2 justify-between items-center w-full">
                        <span>{pool.name}</span>
                        <div className="flex gap-2   items-end">
                          <span className="text-emerald-500">{(Number(pool.apy) / 100).toFixed(2)}% APY</span>
                          <span className="text-xs text-zinc-500">
                            {pool.riskLevel === 1 ? "Low" : pool.riskLevel === 2 ? "Medium" : "High"} Risk
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-zinc-400 font-medium">Deposit Amount</label>
              <span className="text-xs text-zinc-500">Available: {maxAmount.toFixed(4)} BTC</span>
            </div>
            <div className="relative">
              <Input
                type="number"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                placeholder="0.0"
                className="w-full py-6 bg-zinc-800/60 border-zinc-700/70 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 pr-20"
              />
              <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-zinc-400">BTC</span>
              <button
                onClick={() => setDepositAmount(maxAmount.toString())}
                className="absolute right-9 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 transition-colors"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="space-y-3">
            <button
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="flex items-center text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              {advancedOpen ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
              Advanced Options
            </button>
            
            {advancedOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 pt-2"
              >
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400 font-medium flex items-center">
                    <Lock className="h-4 w-4 mr-1 text-emerald-500" />
                    Lock Period (Days)
                  </label>
                  <Select value={lockPeriod} onValueChange={setLockPeriod}>
                    <SelectTrigger className="w-full bg-zinc-800/60 border-zinc-700/70 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50">
                      <SelectValue placeholder="Select lock period" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="0">No Lock (0% bonus)</SelectItem>
                      <SelectItem value="604800">7 Days (+0.5% APY)</SelectItem>
                      <SelectItem value="2592000">30 Days (+2% APY)</SelectItem>
                      <SelectItem value="7776000">90 Days (+5% APY)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/50">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-400">
                      Longer lock periods earn higher APY but funds will not be available for recurring payments during this time.
                      Only use lock periods for funds you won't need for scheduled payments.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Stats */}
          {selectedPoolData && (
            <div className="rounded-lg bg-zinc-800/60 p-4 border border-zinc-700/50">
              <h3 className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-1.5">
                <BarChart className="h-4 w-4 text-emerald-500" />
                Expected Returns
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="text-zinc-400">Base APY</div>
                  <div className="text-white">{(Number(selectedPoolData.apy) / 100).toFixed(2)}%</div>
                </div>
                {lockPeriod !== "0" && (
                  <div className="space-y-1">
                    <div className="text-zinc-400">Lock Bonus</div>
                    <div className="text-emerald-500">
                      +{lockPeriod === "604800" ? "0.5" : lockPeriod === "2592000" ? "2" : "5"}%
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <div className="text-zinc-400">Daily Yield</div>
                  <div className="text-white">
                    {depositAmount ? 
                      `${(parseFloat(depositAmount) * (Number(selectedPoolData.apy) / 10000) / 365).toFixed(6)} BTC` : 
                      "0.00 BTC"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-zinc-400">Monthly Yield</div>
                  <div className="text-white">
                    {depositAmount ? 
                      `${(parseFloat(depositAmount) * (Number(selectedPoolData.apy) / 10000) / 12).toFixed(4)} BTC` : 
                      "0.00 BTC"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Deposit Button */}
          <Button
            onClick={handleDeposit}
            disabled={!depositAmount || parseFloat(depositAmount) <= 0 || parseFloat(depositAmount) > maxAmount || isDepositing}
            className="w-full py-6 bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-emerald-500/20 font-medium rounded-xl transition-all duration-200"
          >
            {isDepositing ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Depositing...
              </>
            ) : (
              <>
                <Droplet className="h-4 w-4 mr-2" />
                Deposit to Liquidity Pool
              </>
            )}
          </Button>
          
          {isSuccess && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
              Deposit successful! Your liquidity position has been created.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}