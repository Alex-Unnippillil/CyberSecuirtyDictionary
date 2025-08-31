#!/usr/bin/env python3
import json
import re
import sys
from textstat import textstat

THRESHOLD = float(sys.argv[1]) if len(sys.argv) > 1 else 12

def split_sentences(text):
    # Simple sentence splitter on punctuation followed by space
    return [s.strip() for s in re.split(r'(?<=[.!?]) +', text.strip()) if s]

with open('terms.json', 'r') as f:
    terms = json.load(f)["terms"]

flagged = []
grades = []
for term in terms:
    definition = term.get("definition", "")
    grade = textstat.flesch_kincaid_grade(definition)
    if grade >= 0:
        grades.append(grade)
    for sentence in split_sentences(definition):
        s_grade = textstat.flesch_kincaid_grade(sentence)
        if s_grade > THRESHOLD:
            flagged.append((term["term"], sentence, s_grade))

average = sum(grades) / len(grades) if grades else 0
print(f"Average grade level: {average:.2f}")
if flagged:
    print(f"Sentences above grade level {THRESHOLD}:")
    for term, sentence, score in flagged:
        print(f"- [{term}] {sentence} (grade {score:.2f})")
else:
    print(f"All sentences are at or below grade level {THRESHOLD}.")
