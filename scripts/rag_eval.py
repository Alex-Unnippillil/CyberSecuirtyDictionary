#!/usr/bin/env python3
"""Nightly RAG evaluation for CyberSecuirtyDictionary.

This script uses the RAGAS library to measure the
faithfulness of generated answers and the strength of
retrieval. Scores are written to ``logs/rag-eval.json`` and
non‑compliant scores cause a non‑zero exit code.
"""

from __future__ import annotations

import json
import os
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import faithfulness, context_precision

# Minimal example data. In a real environment this should
# be replaced with evaluations of the current RAG system.
EXAMPLES = [
    {
        "question": "What is phishing?",
        "contexts": [
            "Phishing is a social engineering attack where attackers deceive victims into revealing information."
        ],
        "answer": "Phishing is a social engineering attack.",
        "ground_truth": "Phishing is a type of social engineering attack that tricks users into revealing sensitive information.",
    }
]

THRESHOLDS = {"faithfulness": 0.8, "context_precision": 0.8}


def main() -> None:
    dataset = Dataset.from_list(EXAMPLES)
    scores = evaluate(dataset, metrics=[faithfulness, context_precision])

    os.makedirs("logs", exist_ok=True)
    with open("logs/rag-eval.json", "w", encoding="utf-8") as f:
        json.dump(scores, f, indent=2)

    regressions = [m for m, v in scores.items() if v < THRESHOLDS.get(m, 0)]
    if regressions:
        raise SystemExit(
            "Regression detected for: " + ", ".join(regressions)
        )


if __name__ == "__main__":
    main()
