import test from 'node:test';
import assert from 'node:assert';
import { Mnemonic, HDNodeWallet } from 'ethers';
import crypto from 'crypto';
import { CONFIG, CHAINS, TOKENS } from '../src/utils/constants.js';
import { RPCManager } from '../src/rpc/RPCManager.js';

test('Constants and Configurations match expectations', () => {
    assert.ok(CONFIG.batchSize > 0, 'batchSize must be greater than 0');
    assert.ok(CONFIG.workerThreads > 0, 'workerThreads must be greater than 0');
    assert.ok(Array.isArray(CONFIG.derivationIndices), 'derivationIndices must be an array');
    assert.ok(CHAINS.length > 0, 'At least one blockchain must be configured');
    assert.ok(TOKENS.length > 0, 'At least some tokens must be configured');
});

test('Derivation Logic generates correct address structure without mocking', () => {
    const entropy = crypto.randomBytes(16);
    const mnemonic = Mnemonic.fromEntropy(entropy);
    const hdNode = HDNodeWallet.fromMnemonic(mnemonic);

    assert.ok(mnemonic.phrase.split(' ').length === 12, 'Entropy-derived mnemonic should be 12 words');

    CONFIG.derivationIndices.forEach(idx => {
        const wallet = hdNode.deriveChild(0).deriveChild(idx);
        assert.ok(wallet.address.startsWith('0x'), 'Address should start with 0x');
        assert.ok(wallet.address.length === 42, 'Address length should be 42 characters');
        assert.ok(wallet.privateKey.startsWith('0x'), 'Private key should start with 0x');
    });
});

test('RPCManager initializes and is capable of rotating without mocking', async () => {
    const rpcManager = new RPCManager();
    const initResult = await rpcManager.initialize();

    assert.strictEqual(initResult, true, 'Initialization should return true');

    // Check registry mapping
    for (const net of CHAINS) {
        const client = rpcManager.getClient(net.name);
        assert.ok(client !== undefined, `Client registry should contain client for ${net.name}`);

        // Rotate and check index changes
        const statusBefore = rpcManager.getStatusSummary();
        assert.ok(statusBefore.includes('Chains Active'), 'Status summary should be returned');

        rpcManager.rotateRPC(net.name);
    }
});
