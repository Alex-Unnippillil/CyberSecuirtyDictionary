# Archive Report

The following features were removed after failing in Safari or Edge due to reliance on experimental Web APIs:

- **linkPreview** – Relies on in-page DOM parsing of remote content, which is blocked in Safari and Edge.
- **search** – Uses the Web Speech API (`SpeechRecognition`/`webkitSpeechRecognition`), unavailable in Safari and Edge.
- **selection** – Depends on the Async Clipboard API (`ClipboardItem`), unsupported in Safari.

These features have been moved to the `archive/` directory for future review.
