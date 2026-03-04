#!/usr/bin/env node

/**
 * SeedphraseScout - Professional Educational Research Tool
 * Version 3.1.0 (2026 Edition)
 */

import { Engine } from './src/core/Engine.js';
import dotenv from 'dotenv';

dotenv.config();

const engine = new Engine();

engine.run().catch((error) => {
    console.error('Fatal Error:', error);
    process.exit(1);
});
