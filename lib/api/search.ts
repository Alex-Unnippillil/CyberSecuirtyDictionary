let controller: AbortController | null = null;

export async function search(query: string): Promise<any> {
  if (controller) {
    controller.abort();
  }

  controller = new AbortController();

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return await response.json();
  } finally {
    controller = null;
  }
}
