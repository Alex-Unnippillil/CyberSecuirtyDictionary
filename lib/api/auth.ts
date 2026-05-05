import { NextRequest } from 'next/server';
import { errorResponse } from './errors';

const mutatingMethods = new Set(['POST', 'PUT', 'DELETE', 'PATCH']);

export interface AuthContext {
  actor: string;
  role: string;
}

export function authorizeMutation(request: NextRequest): { ok: true; auth: AuthContext } | { ok: false; response: Response } {
  if (!mutatingMethods.has(request.method)) {
    return { ok: true, auth: { actor: 'anonymous', role: 'viewer' } };
  }

  const apiKey = request.headers.get('x-api-key');
  const configuredKey = process.env.API_WRITE_TOKEN;

  if (!configuredKey) {
    return {
      ok: false,
      response: errorResponse(503, 'AUTH_NOT_CONFIGURED', 'Mutation auth is not configured on the server.'),
    };
  }

  if (!apiKey || apiKey !== configuredKey) {
    return {
      ok: false,
      response: errorResponse(401, 'UNAUTHORIZED', 'A valid x-api-key is required for mutating routes.'),
    };
  }

  const role = request.headers.get('x-role') || 'editor';
  if (!['admin', 'editor'].includes(role)) {
    return {
      ok: false,
      response: errorResponse(403, 'FORBIDDEN', 'Insufficient role to modify resources.'),
    };
  }

  return {
    ok: true,
    auth: {
      actor: request.headers.get('x-actor') || 'api-key-client',
      role,
    },
  };
}
