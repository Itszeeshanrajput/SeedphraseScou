import { Worker } from 'worker_threads';
import fs from 'fs/promises';
import { CONFIG, CHAINS } from '../utils/constants.js';
import { RPCManager } from '../rpc/RPCManager.js';
import { Checker } from './Checker.js';
import { ProfessionalUI } from '../ui/professional-ui.js';

export class Engine {
    constructor() {
        this.rpcManager = new RPCManager();
        this.checker = null;
        this.ui = new ProfessionalUI();
        this.stats = { total: 0, found: 0, candidates: 0 };
        this.workers = [];
        this.running = false;
        this.hitList = new Set(); 
    }

    async initialize() {
        await this.rpcManager.initialize();
        this.checker = new Checker(this.rpcManager);
        
        // Load hit list stub
        this.hitList.add('0x0000000000000000000000000000000000000000'); 

        // Spawn workers
        for (let i = 0; i < CONFIG.workerThreads; i++) {
            // Using URL relative to this file to locate the worker script
            this.workers.push(new Worker(new URL('./Worker.js', import.meta.url)));
        }

        try {
            const data = await fs.readFile('./progress.json', 'utf8');
            const progress = JSON.parse(data);
            this.stats.total = progress.totalChecked || 0;
            this.stats.found = progress.foundCount || 0;
        } catch (e) {
            // No progress file, start fresh
        }

        return true;
    }

    async run() {
        if (process.argv.includes('--test')) {
            await this.runTest();
            return;
        }

        if (!await this.initialize()) return;
        this.running = true;

        process.on('SIGINT', () => this.shutdown());

        while (this.running) {
            try {
                // Parallel generation
                const workerPromises = this.workers.map(worker => {
                    return new Promise(resolve => {
                        worker.once('message', resolve);
                        worker.postMessage({ count: CONFIG.batchSize / CONFIG.workerThreads });
                    });
                });

                const results = await Promise.all(workerPromises);
                const allWallets = results.flat();
                
                // Scan on-chain
                const found = await this.checker.scanBatch(allWallets);

                for (const hit of found) {
                    const full = allWallets.find(w => w.address === hit.address);
                    this.stats.found++;
                    this.ui.showFoundWallet({ ...full, ...hit });
                    await this.saveHit({ ...full, ...hit });
                }

                this.stats.total += allWallets.length;
                this.ui.update({
                    total: this.stats.total,
                    found: this.stats.found,
                    rpcStatus: this.rpcManager.getStatusSummary(),
                    workers: CONFIG.workerThreads,
                    activeChains: CHAINS.length
                });
                this.ui.render();

                if (this.stats.total % 10000 === 0) {
                    await fs.writeFile('./progress.json', JSON.stringify({
                        totalChecked: this.stats.total,
                        foundCount: this.stats.found,
                        lastUpdate: new Date().toISOString()
                    }));
                }

            } catch (e) {
                // Prevent tight loop on error
                await new Promise(r => setTimeout(r, 1000));
            }
        }
    }

    async runTest() {
        console.log('🧪 Starting System Diagnostics...');
        await this.rpcManager.initialize();
        for (const net of CHAINS) {
            const client = this.rpcManager.getClient(net.name);
            try {
                const block = await client.getBlockNumber();
                console.log(`  ✅ ${net.name.padEnd(12)}: Block ${block}`);
            } catch (e) {
                console.log(`  ❌ ${net.name.padEnd(12)}: Failed`);
            }
        }
        process.exit(0);
    }

    async saveHit(wallet) {
        try {
            let data = {};
            try { data = JSON.parse(await fs.readFile('./cracked.json', 'utf8')); } catch (e) {}
            data[wallet.address] = { ...wallet, foundAt: new Date().toISOString() };
            await fs.writeFile('./cracked.json', JSON.stringify(data, null, 2));
        } catch (e) {}
    }

    async shutdown() {
        this.running = false;
        this.workers.forEach(w => w.terminate());
        this.ui.showFinalStats();
        process.exit(0);
    }
}
