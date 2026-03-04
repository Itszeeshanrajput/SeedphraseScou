# Security Policy

## Supported Versions

Use the latest version of this project for the most secure experience.

| Version | Supported          |
| ------- | ------------------ |
| 3.1.x   | :white_check_mark: |
| 2.x     | :x:                |
| 1.x     | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a vulnerability, please report it privately via email or open a GitHub Security Advisory. Do **not** open a public issue for sensitive security bugs.

## Ethical Usage

This software handles cryptographic material (private keys and mnemonic phrases). While this tool generates these keys locally for educational purposes:

1.  **Never** input your real seed phrase into this or any other unknown tool.
2.  **Audit the code** yourself before running.
3.  The generated keys are ephemeral and should not be used for storing value.

## Dependency Management

We use `npm audit` to check for vulnerabilities in our dependencies (`viem`, `ethers`). Please ensure you keep your `node_modules` up to date.
