import { parentPort } from 'worker_threads';
import { Mnemonic, HDNodeWallet } from 'ethers';
import crypto from 'crypto';
import { CONFIG } from '../utils/constants.js';

parentPort.on('message', async (data) => {
    const wallets = [];
    const count = data.count;

    for (let i = 0; i < count; i++) {
        // 2026 Strategy: Raw Entropy -> Mnemonic -> Multiple Indices
        try {
            const entropy = crypto.randomBytes(16); // 128-bit for 12 words
            const mnemonic = Mnemonic.fromEntropy(entropy);
            const hdNode = HDNodeWallet.fromMnemonic(mnemonic);
            
            // Derive multiple indices (0, 1, 2)
            CONFIG.derivationIndices.forEach(idx => {
                const wallet = hdNode.deriveChild(0).deriveChild(idx);
                wallets.push({
                    address: wallet.address,
                    privateKey: wallet.privateKey,
                    mnemonic: mnemonic.phrase,
                    index: idx
                });
            });
        } catch (e) {
            // Silently fail on generation errors to keep speed up
        }
    }
    parentPort.postMessage(wallets);
});
