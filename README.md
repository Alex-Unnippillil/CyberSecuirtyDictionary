# CyberSecuirtyDictionary

https://alex-unnippillil.github.io/CyberSecuirtyDictionary/
![image](https://github.com/Alex-Unnippillil/CyberSecuirtyDictionary/assets/24538548/c5a54c56-babb-485d-b01c-4fdfb186325b)

## Security

For information on reporting vulnerabilities, please see our [Security Policy](SECURITY.md).

## RAG Evaluation

Nightly GitHub Actions runs `scripts/rag_eval.py` using the [RAGAS](https://github.com/explodinggradients/ragas) library to measure faithfulness and retrieval precision. Scores are written to `logs/rag-eval.json` and a failing run opens an issue when metrics fall below the configured thresholds.
