export interface TermRecord {
  term: string;
  definition: string;
  version: number;
  updatedAt: string;
}

export interface FeedbackRecord {
  message: string;
  email?: string;
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  details?: Record<string, unknown>;
}
