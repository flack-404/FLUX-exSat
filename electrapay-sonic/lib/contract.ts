import { PAYROLL_ABI } from './abi';

export const getContract = () => {
  return {
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: PAYROLL_ABI,
  };
};