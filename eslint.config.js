import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
        rules: {
            'no-unused-vars': ['error', {
                args: 'all',
                argsIgnorePattern: '^_',
                vars: 'all',
                varsIgnorePattern: '^_',
                caughtErrors: 'all',
                caughtErrorsIgnorePattern: '^_'
            }],
            'no-empty': 'off',
            'no-console': 'off',
        },
    },
];
