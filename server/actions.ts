import { addSubscription, removeSubscription, broadcastTermChange } from './notifications';

// Action exposed for other parts of the application to notify subscribers when a
// dictionary term is added or updated.
export async function notifyTermChange(term: string) {
  await broadcastTermChange(term);
}

// Convenience re-exports for subscription management used by API routes
export { addSubscription, removeSubscription };
