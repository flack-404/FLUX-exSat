// privateKeyTest.js
require('dotenv').config();

console.log("Environment variables loaded");
console.log(`Private key length: ${process.env.AGENT_PRIVATE_KEY?.length || 'not found'}`);
console.log(`Private key first 4 chars: ${process.env.AGENT_PRIVATE_KEY?.substring(0, 4) || 'not found'}`);

// Try to fix common issues with private keys
const privateKey = process.env.AGENT_PRIVATE_KEY || '';
const fixedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;

console.log(`Fixed key length: ${fixedKey.length}`);
console.log(`Fixed key first 6 chars: ${fixedKey.substring(0, 6)}`);

// Validate the key format
try {
  const { ethers } = require('ethers');
  const wallet = new ethers.Wallet(fixedKey);
  console.log(`Successfully created wallet with address: ${wallet.address}`);
} catch (error) {
  console.error("Error creating wallet:", error.message);
  
  // Try stripping any whitespace or quotes
  const strippedKey = fixedKey.trim().replace(/^["']|["']$/g, '');
  console.log(`Trying stripped key (length: ${strippedKey.length})`);
  
  try {
    const { ethers } = require('ethers');
    const wallet = new ethers.Wallet(strippedKey);
    console.log(`Success with stripped key! Wallet address: ${wallet.address}`);
    console.log(`Use this format in your .env: AGENT_PRIVATE_KEY=${strippedKey}`);
  } catch (error) {
    console.error("Still failed with stripped key:", error.message);
  }
}