import { parseAbi } from 'viem';
import { 
    mainnet, base, arbitrum, optimism, polygon, 
    scroll, linea, zkSync, blast, mantle 
} from 'viem/chains';
import { availableParallelism } from 'os';
import dotenv from 'dotenv';

// Ensure env vars are loaded
dotenv.config();

export const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11';

export const MULTICALL3_ABI = parseAbi([
    'function getEthBalance(address addr) view returns (uint256)'
]);

export const ERC20_ABI = parseAbi([
    'function balanceOf(address) view returns (uint256)',
    'function symbol() view returns (string)'
]);

export const CHAINS = [
    { 
        id: 1, 
        name: 'Ethereum', 
        chain: mainnet, 
        rpcs: [
            'https://ethereum.publicnode.com',
            'https://eth.llamarpc.com',
            'https://cloudflare-eth.com'
        ] 
    },
    { 
        id: 8453, 
        name: 'Base', 
        chain: base, 
        rpcs: [
            'https://mainnet.base.org',
            'https://base.llamarpc.com'
        ]
    },
    { 
        id: 42161, 
        name: 'Arbitrum', 
        chain: arbitrum, 
        rpcs: [
            'https://arb1.arbitrum.io/rpc',
            'https://arbitrum.llamarpc.com'
        ]
    },
    { 
        id: 10, 
        name: 'Optimism', 
        chain: optimism, 
        rpcs: [
            'https://mainnet.optimism.io',
            'https://optimism.llamarpc.com'
        ]
    },
    { 
        id: 137, 
        name: 'Polygon', 
        chain: polygon, 
        rpcs: [
            'https://polygon-rpc.com',
            'https://polygon.llamarpc.com'
        ]
    },
    { 
        id: 534352, 
        name: 'Scroll', 
        chain: scroll, 
        rpcs: [
            'https://rpc.scroll.io'
        ]
    },
    { 
        id: 59144, 
        name: 'Linea', 
        chain: linea, 
        rpcs: [
            'https://rpc.linea.build'
        ]
    },
    { 
        id: 324, 
        name: 'zkSync', 
        chain: zkSync, 
        rpcs: [
            'https://mainnet.era.zksync.io'
        ]
    },
    { 
        id: 81457, 
        name: 'Blast', 
        chain: blast, 
        rpcs: [
            'https://rpc.blast.io'
        ]
    },
    { 
        id: 5000, 
        name: 'Mantle', 
        chain: mantle, 
        rpcs: [
            'https://rpc.mantle.xyz'
        ]
    }
];

export const TOKENS = [
    // Ethereum Mainnet (ID: 1)
    { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', chainId: 1 },
    { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', chainId: 1 },
    
    // Base (ID: 8453)
    { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', chainId: 8453 },
    { symbol: 'USDT', address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2', chainId: 8453 },

    // Arbitrum (ID: 42161)
    { symbol: 'USDC', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', chainId: 42161 },
    { symbol: 'USDT', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', chainId: 42161 },

    // Polygon (ID: 137)
    { symbol: 'USDC', address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', chainId: 137 },
    { symbol: 'USDT', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', chainId: 137 }
];

export const CONFIG = {
    batchSize: parseInt(process.env.BATCH_SIZE) || 500,
    workerThreads: parseInt(process.env.WORKER_THREADS) || Math.max(2, Math.min(availableParallelism() || 4, 16)),
    minBalance: parseFloat(process.env.MIN_BALANCE) || 0.0001,
    updateInterval: 1000,
    derivationIndices: [0, 1, 2], // Check 3 addresses per mnemonic
};
