// utils/contract.ts
import { ethers } from 'ethers';
import { PAYROLL_ABI } from '@/lib/abi';

export const getContractWithSigner = (signer: ethers.Signer) => {
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    PAYROLL_ABI,
    signer
  );
};

export const getContractWithProvider = (provider: ethers.providers.Provider) => {
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    PAYROLL_ABI,
    provider
  );
};