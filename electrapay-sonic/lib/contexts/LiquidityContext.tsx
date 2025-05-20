// lib/contexts/LiquidityContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the structure of a position
export interface LiquidityPosition {
  id: string;
  pool: string;
  amount: string;
  apy: string;
  depositDate: string;
  lockPeriod: string;
  earnings: string;
  status: string;
}

// Define the context
interface LiquidityContextType {
  positions: LiquidityPosition[];
  addPosition: (position: LiquidityPosition) => void;
  removePosition: (id: string) => void;
  updatePosition: (id: string, position: LiquidityPosition) => void;
}

const LiquidityContext = createContext<LiquidityContextType | undefined>(undefined);

// Provider component
export function LiquidityProvider({ children }: { children: ReactNode }) {
  const [positions, setPositions] = useState<LiquidityPosition[]>([]);

  // Load positions from localStorage on mount
  useEffect(() => {
    const savedPositions = localStorage.getItem('liquidityPositions');
    if (savedPositions) {
      try {
        setPositions(JSON.parse(savedPositions));
      } catch (e) {
        console.error('Error loading liquidity positions:', e);
      }
    }
  }, []);

  // Save positions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('liquidityPositions', JSON.stringify(positions));
  }, [positions]);

  // Add a new position
  const addPosition = (position: LiquidityPosition) => {
    setPositions(prev => [...prev, position]);
  };

  // Remove a position
  const removePosition = (id: string) => {
    setPositions(prev => prev.filter(pos => pos.id !== id));
  };

  // Update a position
  const updatePosition = (id: string, position: LiquidityPosition) => {
    setPositions(prev => prev.map(pos => pos.id === id ? position : pos));
  };

  // In a real implementation, we would also simulate earning yields over time
  useEffect(() => {
    // Simulate earning yields every 30 seconds
    const interval = setInterval(() => {
      if (positions.length > 0) {
        setPositions(prev => prev.map(pos => {
          // Calculate how much was earned since the last update (simplified)
          const dailyYield = parseFloat(pos.amount) * (parseFloat(pos.apy) / 100) / 365;
          const hourlyYield = dailyYield / 24;
          const incrementalYield = hourlyYield / 120; // Small increment for simulation
          
          return {
            ...pos,
            earnings: (parseFloat(pos.earnings) + incrementalYield).toFixed(6)
          };
        }));
      }
    }, 30000); // every 30 seconds
    
    return () => clearInterval(interval);
  }, [positions.length]);

  return (
    <LiquidityContext.Provider value={{ positions, addPosition, removePosition, updatePosition }}>
      {children}
    </LiquidityContext.Provider>
  );
}

// Hook for using the context
export function useLiquidity() {
  const context = useContext(LiquidityContext);
  if (context === undefined) {
    throw new Error('useLiquidity must be used within a LiquidityProvider');
  }
  return context;
}