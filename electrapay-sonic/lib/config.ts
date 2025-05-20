export const HARDCODED_USERS = {
    organization: {
      id: '1',
      email: 'admin@techcorp.com',
      password: 'admin123',
      name: 'TechCorp Inc.',
      type: 'organization'
    },
    employee: {
      id: '1',
      email: 'john@techcorp.com',
      password: 'employee123',
      name: 'John Doe',
      type: 'employee',
      walletAddress: 'put the wallet address'
    }
  };

  export const CHAIN_CONFIG = {
  id: 839999,
  name: 'exSat Hayek Testnet',
  network: 'exsat-hayek-testnet',
  nativeCurrency: {
    name: 'BTC',
    symbol: 'BTC',
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ['https://evm-tst3.exsat.network'] },
    default: { http: ['https://evm-tst3.exsat.network'] },
  },
  blockExplorers: {
    default: { name: 'exSatScan Testnet', url: 'https://scan-testnet.exsat.network' },
  },
} as const;

