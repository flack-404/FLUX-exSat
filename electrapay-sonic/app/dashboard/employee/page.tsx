"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentList } from "@/components/PaymentListEmp";
import type { User } from "@/lib/types";
import { Wallet, ArrowDownCircle, User as UserIcon, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header'; // Import the Header component

export default function EmployeeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      router.push("/auth/employee");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.type !== "employee") {
      router.push("/auth/employee");
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
      {/* Include the Header component */}
      <Header />
      
      <div className="min-h-screen bg-gradient-to-b py-5 from-zinc-900 to-black pt-36 px-4 sm:px-6 lg:px-8 relative">
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
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
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
            <div className="flex items-center gap-4 mb-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-white/60 bg-clip-text text-transparent mb-1">
                  Welcome, {user.name || "Employee"}
                </h1>
                <p className="text-zinc-400">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
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
            <motion.div 
              className="bg-zinc-800/40 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:bg-zinc-800/60 hover:border-emerald-500/30 group"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className="relative">
                  <Wallet className="h-7 w-7 text-emerald-500 mr-3 group-hover:scale-110 transition-all" />
                  <div className="absolute -inset-1 bg-emerald-500/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h2 className="text-xl font-semibold text-white">Wallet Balance</h2>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">$5,234.56</p>
              <div className="mt-2 flex items-center">
                <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400 flex items-center">
                  <Activity className="h-3 w-3 mr-1" />
                  +12% this month
                </span>
              </div>
            </motion.div>

            <motion.div 
              className="bg-zinc-800/40 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:bg-zinc-800/60 hover:border-emerald-500/30 group"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className="relative">
                  <ArrowDownCircle className="h-7 w-7 text-emerald-500 mr-3 group-hover:scale-110 transition-all" />
                  <div className="absolute -inset-1 bg-emerald-500/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h2 className="text-xl font-semibold text-white">Last Payment</h2>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">$1,500.00</p>
              <p className="mt-2 text-sm text-zinc-400 flex items-center">
                <Clock className="h-3 w-3 mr-1 text-zinc-500" />
                Received on May 1, 2023
              </p>
            </motion.div>

            <motion.div 
              className="bg-zinc-800/40 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:bg-zinc-800/60 hover:border-emerald-500/30 group"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className="relative">
                  <Clock className="h-7 w-7 text-emerald-500 mr-3 group-hover:scale-110 transition-all" />
                  <div className="absolute -inset-1 bg-emerald-500/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h2 className="text-xl font-semibold text-white">Next Payment</h2>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">$1,500.00</p>
              <p className="mt-2 text-sm text-zinc-400 flex items-center">
                <Clock className="h-3 w-3 mr-1 text-zinc-500" />
                Expected on June 1, 2023
              </p>
            </motion.div>
          </motion.div>

          {/* Payment History */}
          <motion.div 
            id="payments"
            className="bg-zinc-800/40 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={2}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Your Payments</h2>
              <button className="px-4 py-2 text-sm rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                View All
              </button>
            </div>
            <PaymentList type="employee" />
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