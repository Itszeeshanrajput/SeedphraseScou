import { formatEther } from 'viem';
import { CONFIG, CHAINS, MULTICALL3_ADDRESS, MULTICALL3_ABI, ERC20_ABI, TOKENS } from '../utils/constants.js';

export class Checker {
    constructor(rpcManager) {
        this.rpcManager = rpcManager;
    }

    async scanBatch(wallets) {
        const addresses = wallets.map(w => w.address);

        const scanPromises = CHAINS.map(async (net) => {
            try {
                const client = this.rpcManager.getClient(net.name);
                if (!client) return [];

                const contracts = [];
                addresses.forEach(addr => {
                    contracts.push({ address: MULTICALL3_ADDRESS, abi: MULTICALL3_ABI, functionName: 'getEthBalance', args: [addr] });
                    TOKENS.forEach(token => {
                        if (token.chainId === net.id) {
                            contracts.push({ address: token.address, abi: ERC20_ABI, functionName: 'balanceOf', args: [addr] });
                        }
                    });
                });

                const results = await client.multicall({ contracts, allowFailure: true });
                const hits = [];
                let resIdx = 0;

                addresses.forEach(addr => {
                    let hasAssets = false;
                    let ethBal = 0;
                    const tokens = [];

                    const ethRes = results[resIdx++];
                    if (ethRes.status === 'success') {
                        ethBal = parseFloat(formatEther(ethRes.result));
                        if (ethBal >= CONFIG.minBalance) hasAssets = true;
                    }

                    TOKENS.forEach(token => {
                        if (token.chainId === net.id) {
                            const tRes = results[resIdx++];
                            if (tRes.status === 'success') {
                                const tBal = parseFloat(formatEther(tRes.result));
                                if (tBal > 0) {
                                    hasAssets = true;
                                    tokens.push(`${tBal.toFixed(2)} ${token.symbol}`);
                                }
                            }
                        }
                    });

                    if (hasAssets) {
                        hits.push({ address: addr, balance: ethBal.toFixed(6), chain: net.name, tokens });
                    }
                });

                return hits;
            } catch (e) {
                this.rpcManager.rotateRPC(net.name);
                return [];
            }
        });

        const all = await Promise.all(scanPromises);
        return all.flat();
    }
}
