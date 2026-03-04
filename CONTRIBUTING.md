# Contributing to SeedphraseScout

Thank you for your interest in contributing to this educational project!

## Code of Conduct

This project is intended for educational research into blockchain cryptography and network communication. We do not tolerate:
*   Malicious features (e.g., exfiltrating data).
*   Code that encourages or facilitates theft.
*   Spam or low-effort PRs.

## How to Contribute

1.  **Fork** the repository.
2.  **Create a branch** for your feature (`git checkout -b feature/amazing-feature`).
3.  **Commit** your changes (`git commit -m 'Add some amazing feature'`).
4.  **Push** to the branch (`git push origin feature/amazing-feature`).
5.  **Open a Pull Request**.

## Coding Standards

*   **Syntax:** Modern ES Modules (ESM) with async/await.
*   **Style:** Use clean, readable variable names.
*   **Structure:** Keep logic separated (Core vs. UI vs. RPC).
*   **Dependencies:** Minimize new dependencies. Prefer native Node.js APIs where possible.

## Testing

Please test your changes locally before submitting.

```bash
npm test
```

Ensure the diagnostics pass and the engine runs without crashing.
