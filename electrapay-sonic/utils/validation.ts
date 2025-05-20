// utils/validation.ts
import { ethers } from 'ethers';

export const isValidAddress = (address: string) => {
  try {
    return ethers.utils.isAddress(address);
  } catch {
    return false;
  }
};

export const isValidAmount = (amount: string) => {
  try {
    const value = ethers.utils.parseEther(amount);
    return value.gt(0);
  } catch {
    return false;
  }
};