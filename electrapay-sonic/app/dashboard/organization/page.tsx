"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PaymentForm } from "@/components/PaymentForm";
import { PaymentList } from "@/components/PaymentList";
import type { User } from "@/lib/types";
import { 
  Users, CreditCard, DollarSign, ArrowRight, BarChart3, 
  Plus, Filter, Download, Zap, Wallet,
  ActivitySquare, ChevronDown
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { useAccount } from "wagmi";
import { AgentStatusComponent } from "@/components/AgentStatusComponent";

export default function SimplifiedDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    setMounted(true);
    
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      router.push("/auth/organization");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.type !== "organization") {
      router.push("/auth/organization");
      return;
    }

    setUser(parsedUser);
    
    // Clean up on unmount
    return () => setMounted(false);
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4"></div>
          <div className="text-2xl font-semibold bg-gradient-to-r from-white via-emerald-200 to-white/60 bg-clip-text text-transparent">Loading...</div>
        </div>
      </div>
    );
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      }
    })
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black pt-36 px-4 sm:px-6 lg:px-8 relative">
        {/* Background Elements */}
        {mounted && (
          <>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Grid overlay */}
              <div 
                className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"
                style={{
                  backgroundPosition: '0 0, 0 0',
                  opacity: 0.15
                }}
              />
              
              {/* Glowing orbs */}
              <>
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
              </>
            </div>
          </>
        )}
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header with welcome message */}
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-center">
                  <Users className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-white/60 bg-clip-text text-transparent mb-1">
                    Organization Dashboard
                  </h1>
                  <p className="text-zinc-400">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800/80 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800/80 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  <span>Reports</span>
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={1}
          >
            {[
              { 
                icon: Users, 
                title: "Total Employees", 
                value: "156", 
                trend: "+12% from last month",
                trendPositive: true
              },
              { 
                icon: CreditCard, 
                title: "Active Payments", 
                value: "23", 
                trend: "+5 new this week",
                trendPositive: true
              },
              { 
                icon: DollarSign, 
                title: "Total Paid (This Month)", 
                value: "$253,890.00", 
                trend: "+18.3% vs last month",
                trendPositive: true
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:bg-zinc-800/60 hover:border-emerald-500/30 group">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="relative">
                        <stat.icon className="h-7 w-7 text-emerald-500 mr-3 group-hover:scale-110 transition-all" />
                        <div className="absolute -inset-1 bg-emerald-500/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <h2 className="text-xl font-semibold text-white">{stat.title}</h2>
                    </div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">{stat.value}</p>
                    <div className="mt-2 flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${stat.trendPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} flex items-center`}>
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
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm h-full hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6 flex items-center gap-2">
                    Setup New Payment
                    <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-normal flex items-center">
                      <Plus className="h-3 w-3 mr-1" />
                      New
                    </span>
                  </h2>
                  <PaymentForm />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm h-full hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6 flex items-center justify-between">
                    Active Payments
                    <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors px-3 py-1 rounded-lg hover:bg-emerald-500/10">
                      View All
                    </button>
                  </h2>
                  <PaymentList type="organization" />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <AgentStatusComponent />
          </motion.div>
        </div>

        {/* Add CSS animations */}
        <style jsx global>{`
          @keyframes gradient-x {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          
          .animate-gradient-x {
            background-size: 200% 100%;
            animation: gradient-x 15s ease infinite;
          }
        `}</style>
      </div>
    </>
  );
}