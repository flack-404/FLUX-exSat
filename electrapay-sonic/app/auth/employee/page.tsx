"use client";

import { LoginForm } from '@/components/LoginForm';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function EmployeeLogin() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      {mounted && (
        <>
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-emerald-500/20 blur-xl"
                style={{
                  width: `${Math.random() * 200 + 50}px`,
                  height: `${Math.random() * 200 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.2,
                  animation: `float ${Math.random() * 20 + 15}s linear infinite`,
                  animationDelay: `${Math.random() * 10}s`,
                  transform: `translate(-50%, -50%)`
                }}
              />
            ))}
          </div>
          
          {/* Grid overlay */}
          <div 
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"
            style={{
              backgroundPosition: '0 0, 0 0',
              opacity: 0.15
            }}
          />
          
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-70 pointer-events-none" />
        </>
      )}

      {/* Login Card with Enhanced Animation and Effects */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="  max-w-md w-full space-y-8 bg-zinc-800/40 p-8 sm:p-10 rounded-xl backdrop-blur-md border border-zinc-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 relative z-10"
      >
        {/* Glow effect behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 via-emerald-500/5 to-emerald-600/20 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000 -z-10"></div>
        
        <div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="mx-auto h-14 w-14 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center relative"
          >
            <Shield className="h-8 w-8 text-black" />
            <div className="absolute -inset-1 bg-emerald-500/30 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s' }}></div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-white via-emerald-200 to-white/60 bg-clip-text text-transparent animate-gradient-x"
          >
            Employee Login
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-2 text-center text-sm text-zinc-400"
          >
            Access your account to manage your payments and profile
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <LoginForm type="employee" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center"
        >
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-emerald-500 hover:text-emerald-300 transition-colors py-2 px-4 rounded-lg hover:bg-emerald-500/10 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-50px) rotate(180deg);
          }
          100% {
            transform: translate(-50%, -50%) translateY(0px) rotate(360deg);
          }
        }
        
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
        
        .bg-gradient-radial {
          background-image: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}</style>
    </div>
  );
}