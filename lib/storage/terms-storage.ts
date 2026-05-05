import fs from 'node:fs/promises';
import path from 'node:path';
import { TermRecord } from './types';

interface TermsFile {
  terms: Array<Partial<TermRecord> & { term: string; definition: string }>;
}

const termsFile = path.join(process.cwd(), 'terms.json');

function normalizeTerm(term: Partial<TermRecord> & { term: string; definition: string }): TermRecord {
  return {
    term: term.term,
    definition: term.definition,
    version: Number.isFinite(term.version) ? Number(term.version) : 1,
    updatedAt: term.updatedAt || new Date().toISOString(),
  };
}

async function readTermsFile(): Promise<TermRecord[]> {
  const raw = await fs.readFile(termsFile, 'utf8');
  const parsed: TermsFile = JSON.parse(raw);
  return (parsed.terms || []).map(normalizeTerm);
}

async function writeTermsFile(terms: TermRecord[]): Promise<void> {
  await fs.writeFile(termsFile, JSON.stringify({ terms }, null, 2), 'utf8');
}

export async function listTerms(): Promise<TermRecord[]> {
  return readTermsFile();
}

export async function createTerm(input: { term: string; definition: string }): Promise<TermRecord> {
  const terms = await readTermsFile();
  if (terms.some((item) => item.term === input.term)) {
    throw new Error('TERM_EXISTS');
  }

  const created: TermRecord = {
    term: input.term,
    definition: input.definition,
    version: 1,
    updatedAt: new Date().toISOString(),
  };

  terms.push(created);
  await writeTermsFile(terms);
  return created;
}

export async function updateTerm(
  termName: string,
  input: { definition: string; expectedVersion?: number }
): Promise<TermRecord> {
  const terms = await readTermsFile();
  const idx = terms.findIndex((item) => item.term === termName);
  if (idx < 0) {
    throw new Error('TERM_NOT_FOUND');
  }

  const current = terms[idx];
  if (
    typeof input.expectedVersion === 'number' &&
    Number.isFinite(input.expectedVersion) &&
    current.version !== input.expectedVersion
  ) {
    throw new Error('VERSION_CONFLICT');
  }

  const updated: TermRecord = {
    ...current,
    definition: input.definition,
    version: current.version + 1,
    updatedAt: new Date().toISOString(),
  };

  terms[idx] = updated;
  await writeTermsFile(terms);
  return updated;
}

export async function deleteTerm(termName: string): Promise<TermRecord> {
  const terms = await readTermsFile();
  const idx = terms.findIndex((item) => item.term === termName);
  if (idx < 0) {
    throw new Error('TERM_NOT_FOUND');
  }

  const [removed] = terms.splice(idx, 1);
  await writeTermsFile(terms);
  return removed;
}
