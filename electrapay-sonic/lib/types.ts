// lib/types.ts
export interface Payment {
  id: string;
  recipient: string;
  amount: string;
  interval: number;
  lastPayment: number;
  isActive: boolean;
  canProcess: boolean;
  formattedData: {
    amount: string;
    interval: string;
    lastPayment: string;
    nextPayment: string;
  };
}
export interface User {
  id: string;
  email: string;
  name: string;
  type: "organization" | "employee";
  walletAddress?: string;
}

export interface Payment {
  id: string;
  recipient: string;
  amount: string;
  interval: number;
  lastPayment: number;
  isActive: boolean;
}

export interface PaymentData {
  recipient: `0x${string}`; // Ethereum address
  amount: bigint; // uint96 in contract
  interval: bigint; // uint64 in contract
  lastPayment: bigint; // uint64 in contract
  isActive: boolean;
}
