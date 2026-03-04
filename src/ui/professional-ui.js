/**
 * Professional Clean UI - 2026 Hyper-Growth Edition
 * Modern, sleek, and minimalistic dashboard with token support
 */

const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    
    // Colors
    primary: '\x1b[38;5;75m',    // Soft blue
    success: '\x1b[38;5;71m',    // Green
    warning: '\x1b[38;5;214m',   // Orange
    danger: '\x1b[38;5;196m',    // Red
    info: '\x1b[38;5;147m',      // Purple
    gray: '\x1b[38;5;245m',
    white: '\x1b[38;5;255m',
};

const txt = (color, text) => `${color}${text}${c.reset}`;

export class ProfessionalUI {
    constructor() {
        this.stats = {
            total: 0,
            found: 0,
            speed: 0,
            startTime: Date.now(),
            rpcStatus: 'Initializing...',
            rpcLatency: 0,
            batchSize: 0,
            workers: 0,
            activeChains: 0,
        };
        this.lastRender = 0;
        this.updateInterval = 1000;
    }

    update(newStats) {
        this.stats = { ...this.stats, ...newStats };
        const elapsed = (Date.now() - this.stats.startTime) / 1000;
        this.stats.speed = elapsed > 0 ? (this.stats.total / elapsed).toFixed(1) : 0;
    }

    render() {
        const now = Date.now();
        if (now - this.lastRender < this.updateInterval) return;
        this.lastRender = now;

        const elapsed = ((Date.now() - this.stats.startTime) / 1000).toFixed(0);
        const speed = parseFloat(this.stats.speed).toFixed(1);
        const timeFormatted = this.formatTime(parseFloat(elapsed));

        // Clear screen
        console.clear();

        // Header
        console.log();
        console.log('  ' + txt(c.bold, 'ETH BRUTE FORCE 2026') + txt(c.gray, '  •  ') + txt(c.primary, 'HYPER-GROWTH EDITION'));
        console.log('  ' + txt(c.gray, '─'.repeat(60)));
        console.log();

        // Main Stats Grid
        console.log('  ' + txt(c.gray, '┌') + '─'.repeat(58) + txt(c.gray, '┐'));
        console.log('  ' + txt(c.gray, '│') + this.centerText('🚀 REAL-TIME ENGINE STATUS', 58) + txt(c.gray, '│'));
        console.log('  ' + txt(c.gray, '├') + '─'.repeat(58) + txt(c.gray, '┤'));
        console.log('  ' + txt(c.gray, '│') + '  Keys Checked:'.padEnd(20) + this.formatNumber(this.stats.total).padStart(38) + txt(c.gray, '│'));
        console.log('  ' + txt(c.gray, '│') + '  Wallets Found:'.padEnd(20) + txt(c.success, this.stats.found.toString().padStart(38)) + txt(c.gray, '│'));
        console.log('  ' + txt(c.gray, '│') + '  Scan Speed:'.padEnd(20) + txt(c.primary, (speed + ' keys/s').padStart(38)) + txt(c.gray, '│'));
        console.log('  ' + txt(c.gray, '│') + '  Uptime:'.padEnd(20) + txt(c.warning, timeFormatted.padStart(38)) + txt(c.gray, '│'));
        console.log('  ' + txt(c.gray, '├') + '─'.repeat(58) + txt(c.gray, '┤'));
        console.log('  ' + txt(c.gray, '│') + '  Active Networks:'.padEnd(20) + (this.stats.activeChains + ' Blockchains').padStart(38) + txt(c.gray, '│'));
        console.log('  ' + txt(c.gray, '│') + '  RPC Registry:'.padEnd(20) + txt(c.info, (this.stats.rpcStatus).padStart(38)) + txt(c.gray, '│'));
        console.log('  ' + txt(c.gray, '│') + '  Parallel Workers:'.padEnd(20) + (this.stats.workers + ' Threads').padStart(38) + txt(c.gray, '│'));
        console.log('  ' + txt(c.gray, '└') + '─'.repeat(58) + txt(c.gray, '┘'));
        console.log();

        // Legend
        console.log('  ' + txt(c.dim, 'Precision Scan: ETH + USDT + USDC (Multi-Index Derivation 0,1,2)'));
        console.log('  ' + txt(c.dim, 'L2 Priority Enabled: Base, Arbitrum, Optimism, Polygon...'));
        console.log('  ' + txt(c.gray, 'Press Ctrl+C to safely stop and save progress.json'));
        console.log();
    }

    centerText(text, width) {
        const padding = Math.floor((width - text.length) / 2);
        return ' '.repeat(padding) + text + ' '.repeat(width - text.length - padding);
    }

    formatNumber(num) {
        return num.toLocaleString();
    }

    formatTime(seconds) {
        if (seconds < 60) return `${Math.floor(seconds)}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
        return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    }

    showFoundWallet(wallet) {
        console.clear();
        
        const balanceStr = wallet.tokens && wallet.tokens.length > 0 
            ? `${wallet.balance} ETH + ${wallet.tokens.join(', ')}`
            : `${wallet.balance} ETH`;

        console.log();
        console.log(txt(c.bold + c.success, '  ╔══════════════════════════════════════════════════════════════╗'));
        console.log(txt(c.success, '  ║') + txt(c.bold, '                    💰 ASSETS DETECTED! 💰                 ') + txt(c.success, '║'));
        console.log(txt(c.success, '  ╠══════════════════════════════════════════════════════════════╣'));
        console.log(txt(c.success, '  ║') + txt(c.white, `  Address:  ${wallet.address}`) + ' '.repeat(Math.max(0, 42 - wallet.address.length)) + txt(c.success, '  ║'));
        console.log(txt(c.success, '  ║') + txt(c.success, `  Assets:   ${balanceStr}`) + ' '.repeat(Math.max(0, 43 - balanceStr.length)) + txt(c.success, ' ║'));
        console.log(txt(c.success, '  ║') + txt(c.gray, `  Network:  ${wallet.chain || "Multi-Chain"}`) + ' '.repeat(Math.max(0, 42 - (wallet.chain || "Multi-Chain").length)) + txt(c.success, '  ║'));
        console.log(txt(c.success, '  ╠══════════════════════════════════════════════════════════════╣'));
        console.log(txt(c.success, '  ║') + txt(c.warning, '  Mnemonic:'))
        
        const words = (wallet.mnemonic || '').split(' ');
        for (let i = 0; i < words.length; i += 4) {
            const line = words.slice(i, i + 4).join(' ');
            console.log(txt(c.success, '  ║') + txt(c.warning, `  ${line}`) + ' '.repeat(52 - line.length) + txt(c.success, '║'));
        }
        
        console.log(txt(c.success, '  ╠══════════════════════════════════════════════════════════════╣'));
        console.log(txt(c.success, '  ║') + txt(c.gray, '  ✓ Saved to cracked.json (High Priority)') + ' '.repeat(18) + txt(c.success, '║'));
        console.log(txt(c.success, '  ╚══════════════════════════════════════════════════════════════╝'));
        console.log();
    }

    showFinalStats() {
        console.log();
        console.log(txt(c.gray, '  ' + '═'.repeat(60)));
        console.log(txt(c.bold, '  Engine Summary'));
        console.log(txt(c.gray, '  ' + '─'.repeat(60)));
        console.log(txt(c.white, `  Total Keys:       ${this.formatNumber(this.stats.total)}`));
        console.log(txt(c.success, `  Total Hits:       ${this.formatNumber(this.stats.found)}`));
        console.log(txt(c.primary, `  Final Speed:      ${this.stats.speed} keys/s`));
        console.log(txt(c.gray, '  ' + '═'.repeat(60)));
        console.log();
    }
}
