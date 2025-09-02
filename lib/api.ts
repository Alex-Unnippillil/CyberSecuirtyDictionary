export interface FetchResult<T> {
  data: T | null;
  error: Error | null;
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<FetchResult<T>> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      return {
        data: null,
        error: new Error(`Request failed: ${res.status} ${res.statusText}`)
      };
    }
    const data = (await res.json()) as T;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export interface GithubRepo {
  full_name: string;
  description: string;
  stargazers_count: number;
}

export async function fetchGithubRepo(owner: string, repo: string) {
  return fetchJson<GithubRepo>(`https://api.github.com/repos/${owner}/${repo}`);
}
