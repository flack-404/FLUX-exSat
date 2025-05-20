"use client";

  import { useState, useEffect } from "react";
  import { parseEther } from "viem";
  import { useAccount, useWalletClient, usePublicClient } from "wagmi";
  import { getContract } from "@/lib/contract";
  import { Wallet, Clock, DollarSign, AlertCircle, CheckCircle2, ChevronDown, Calendar, RefreshCw } from "lucide-react";
  import { motion, AnimatePresence } from "framer-motion";

  // Predefined intervals for better UX
  const INTERVAL_OPTIONS = [
    { label: "1 minute (testing only)", value: 60 },
    { label: "5 minutes (testing only)", value: 300 },
    { label: "Hourly", value: 3600 },
    { label: "Daily", value: 86400 },
    { label: "Weekly", value: 604800 },
    { label: "Monthly (30 days)", value: 2592000 }
  ];

  export function PaymentForm() {
    const { address } = useAccount();
    const { data: walletClientData } = useWalletClient();
    const publicClient = usePublicClient();

    const [walletClient, setWalletClient] = useState<typeof walletClientData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [customInterval, setCustomInterval] = useState(false);
    const [amountValue, setAmountValue] = useState("");
    const [recipientValue, setRecipientValue] = useState("");

    // Defer state updates to avoid hydration errors
    useEffect(() => {
      setWalletClient(walletClientData || null);
    }, [walletClientData]);

    useEffect(() => {
      if (!address) setError("Please connect your wallet");
      else setError(""); // Clear error when wallet is connected
    }, [address]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!address || !walletClient || !publicClient) return;

      const form = e.currentTarget;
      setLoading(true);
      setError("");
      setSuccess(false);

      try {
        const formData = new FormData(form);
        const recipient = formData.get("recipient") as string;
        const amount = parseEther(formData.get("amount") as string);
        
        // Get interval based on selection or custom input
        let interval: bigint;
        if (customInterval) {
          interval = BigInt(formData.get("customInterval") as string);
        } else {
          interval = BigInt(formData.get("interval") as string);
        }
        
        // Validate minimum interval
        if (interval < BigInt(60)) {
          setError("Interval must be at least 60 seconds");
          setLoading(false);
          return;
        }

        const contract = getContract();

        // Set gas limit higher than default to prevent failures
        const { request } = await publicClient.simulateContract({
          address: contract.address,
          abi: contract.abi,
          functionName: "setupRecurringPayment",
          args: [recipient, amount, interval],
          account: address,
        });

        const hash = await walletClient.writeContract({
          ...request,
          gas: request.gas ? (request.gas * BigInt(120)) / BigInt(100) : undefined // Add 20% buffer
        });
        
        await publicClient.waitForTransactionReceipt({ hash });

        setSuccess(true);
        form.reset(); // Reset form after successful submission
        setAmountValue("");
        setRecipientValue("");
        setCustomInterval(false);
      } catch (err) {
        console.error("Payment setup error:", err);
        setError("Failed to setup payment: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const toggleIntervalType = () => {
      setCustomInterval(!customInterval);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm"
              >
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span>Payment successfully set up!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-5">
            <div className="space-y-2.5">
              <label className="block text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-emerald-500" />
                Recipient Address
              </label>
              <div className="relative group">
                <input
                  name="recipient"
                  required
                  value={recipientValue}
                  onChange={(e) => setRecipientValue(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800/60 border border-zinc-700/70 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 placeholder:text-zinc-500 text-white backdrop-blur-sm"
                  placeholder="0x..."
                />
                <div className="absolute inset-0 rounded-xl border border-emerald-500/0 group-hover:border-emerald-500/30 pointer-events-none transition-all duration-300"></div>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="block text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                Amount (BTC)
              </label>
              <div className="relative group">
                <input
                  type="number"
                  name="amount"
                  step="0.000000000000000001"
                  required
                  value={amountValue}
                  onChange={(e) => setAmountValue(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800/60 border border-zinc-700/70 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 placeholder:text-zinc-500 text-white backdrop-blur-sm"
                  placeholder="0.0"
                />
                <div className="absolute inset-0 rounded-xl border border-emerald-500/0 group-hover:border-emerald-500/30 pointer-events-none transition-all duration-300"></div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4 text-emerald-500" />
                  Payment Interval
                </label>
                <button
                  type="button"
                  onClick={toggleIntervalType}
                  className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-emerald-500/10"
                >
                  {customInterval ? "Use preset intervals" : "Set custom interval"}
                </button>
              </div>
              
              <AnimatePresence mode="wait">
                {customInterval ? (
                  <motion.div
                    key="custom"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="relative group"
                  >
                    <div className="flex items-center">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 h-5 w-5" />
                      <input
                        type="number"
                        name="customInterval"
                        min="60"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-zinc-800/60 border border-zinc-700/70 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 placeholder:text-zinc-500 text-white backdrop-blur-sm"
                        placeholder="Time in seconds (min 60)"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-xl border border-emerald-500/0 group-hover:border-emerald-500/30 pointer-events-none transition-all duration-300"></div>
                    <span className="text-xs text-zinc-500 mt-1.5 block pl-1">
                      Minimum recommended: 60 seconds
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preset"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="relative group"
                  >
                    <div className="flex items-center">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 h-5 w-5 pointer-events-none" />
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4 pointer-events-none" />
                      <select
                        name="interval"
                        required
                        className="w-full appearance-none pl-10 pr-8 py-3 bg-zinc-800/60 border border-zinc-700/70 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 text-white backdrop-blur-sm"
                        defaultValue={INTERVAL_OPTIONS[0].value}
                      >
                        {INTERVAL_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="absolute inset-0 rounded-xl border border-emerald-500/0 group-hover:border-emerald-500/30 pointer-events-none transition-all duration-300"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading || !address || !walletClient}
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
            transition={{ duration: 0.2 }}
            className={`w-full py-3 rounded-xl font-medium text-black focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none mt-4 
            ${loading ? 'bg-emerald-500/70' : 'bg-emerald-500 hover:bg-emerald-400'} 
            transition-all duration-200 flex items-center justify-center gap-2`}
          >
            {!address ? (
              <>
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </>
            ) : loading ? (
              <>
                <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Setting up...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Setup Payment
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    );
  }