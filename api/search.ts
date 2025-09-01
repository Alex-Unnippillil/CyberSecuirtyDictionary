/**
 * Performs a search request against the backend API. The fuzzy flag is
 * forwarded to the backend via the query string to enable or disable fuzzy
 * matching server-side.
 */
export async function search(term: string, fuzzy: boolean = false) {
  const params = new URLSearchParams({ q: term });
  params.set('fuzzy', fuzzy ? 'true' : 'false');
  const response = await fetch(`/api/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Search request failed');
  }
  return response.json();
}

