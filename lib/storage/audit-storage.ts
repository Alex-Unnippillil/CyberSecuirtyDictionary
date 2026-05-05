import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { AuditLogEntry } from './types';

const auditFile = path.join(process.cwd(), 'audit-log.jsonl');

export async function appendAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> {
  const complete: AuditLogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...entry,
  };

  await fs.appendFile(auditFile, `${JSON.stringify(complete)}\n`, 'utf8');
  return complete;
}
