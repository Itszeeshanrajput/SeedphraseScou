import { createPublicClient, http } from 'viem';
import { CHAINS } from '../utils/constants.js';

export class RPCManager {
    constructor() {
        this.registry = new Map();
    }

    async initialize() {
        for (const net of CHAINS) {
            const clients = net.rpcs.map(url => createPublicClient({
                chain: net.chain,
                transport: http(url, { timeout: 5000, retryCount: 0 }),
                batch: { multicall: true }
            }));

            this.registry.set(net.name, {
                chain: net,
                clients: clients,
                currentIndex: 0,
                errors: 0,
                status: 'online'
            });
        }
        return true;
    }

    getClient(chainName) {
        const entry = this.registry.get(chainName);
        if (!entry || entry.status === 'offline') return null;
        return entry.clients[entry.currentIndex];
    }

    rotateRPC(chainName) {
        const entry = this.registry.get(chainName);
        if (entry) {
            entry.currentIndex = (entry.currentIndex + 1) % entry.clients.length;
            entry.errors++;
            if (entry.errors > entry.clients.length * 3) entry.status = 'degraded';
        }
    }

    getStatusSummary() {
        const online = Array.from(this.registry.values()).filter(v => v.status === 'online').length;
        return `${online}/${CHAINS.length} Chains Active`;
    }
}
