#!/usr/bin/env python3
import argparse
import json
from itertools import combinations
import yaml
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def load_terms(path):
    with open(path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)

def check_collisions(data, threshold=0.8):
    results = {
        'title_collisions': [],
        'synonym_collisions': [],
        'definition_collisions': []
    }
    title_map = {}
    synonym_map = {}
    definitions = []
    slugs = []
    titles = []

    for entry in data:
        title = entry.get('name', '').strip().lower()
        slug = entry.get('slug')
        titles.append(title)
        slugs.append(slug)
        definitions.append(entry.get('definition', ''))
        title_map.setdefault(title, []).append(slug)
        for syn in entry.get('synonyms', []) or []:
            syn_l = syn.strip().lower()
            synonym_map.setdefault(syn_l, []).append(slug)

    for title, sl in title_map.items():
        if len(sl) > 1:
            results['title_collisions'].append({'title': title, 'slugs': sl})

    for syn, sl in synonym_map.items():
        overlap = set(sl)
        if syn in title_map:
            overlap.update(title_map[syn])
        if len(overlap) > 1:
            results['synonym_collisions'].append({'synonym': syn, 'slugs': sorted(overlap)})

    if len(definitions) > 1:
        vectorizer = TfidfVectorizer().fit_transform(definitions)
        sim_matrix = cosine_similarity(vectorizer)
        for i, j in combinations(range(len(definitions)), 2):
            score = sim_matrix[i, j]
            if score >= threshold:
                results['definition_collisions'].append({
                    'slugs': [slugs[i], slugs[j]],
                    'similarity': float(score)
                })
    results['total'] = (len(results['title_collisions']) +
                         len(results['synonym_collisions']) +
                         len(results['definition_collisions']))
    return results


def main():
    parser = argparse.ArgumentParser(description='Check term collisions.')
    parser.add_argument('--data', default='data/terms.yaml', help='Path to terms YAML file')
    parser.add_argument('--output', default='collisions.json', help='File to write collision report JSON')
    parser.add_argument('--threshold', type=float, default=0.8, help='Cosine similarity threshold')
    args = parser.parse_args()

    terms = load_terms(args.data)
    report = check_collisions(terms, threshold=args.threshold)

    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)

    if report['total']:
        print(json.dumps(report, indent=2))

if __name__ == '__main__':
    main()
