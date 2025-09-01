export function useChat({
  endpoint = "/api/chat",
  maxRetries = 2,
  retryDelay = 500,
  throttleMs = 100,
} = {}) {
  const state = { messages: [] };
  let controller = null;
  const listeners = new Set();
  let throttleTimeout = null;

  function notify() {
    if (throttleTimeout) return;
    throttleTimeout = setTimeout(() => {
      throttleTimeout = null;
      const snapshot = state.messages.slice();
      listeners.forEach((fn) => fn(snapshot));
    }, throttleMs);
  }

  function subscribe(fn) {
    listeners.add(fn);
    fn(state.messages.slice());
    return () => listeners.delete(fn);
  }

  async function performRequest(message, retriesLeft) {
    controller = new AbortController();
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      state.messages.push({ role: "assistant", content: data.reply });
      notify();
      controller = null;
      return data;
    } catch (err) {
      if (err.name === "AbortError") {
        state.messages.push({ role: "system", content: "Request aborted" });
        notify();
        controller = null;
        throw err;
      }
      if (retriesLeft > 0) {
        await new Promise((r) => setTimeout(r, retryDelay));
        return performRequest(message, retriesLeft - 1);
      }
      state.messages.push({ role: "error", content: err.message });
      notify();
      controller = null;
      throw err;
    }
  }

  async function send(message, { retries = maxRetries } = {}) {
    state.messages.push({ role: "user", content: message });
    notify();
    return performRequest(message, retries);
  }

  function stop() {
    if (controller) {
      controller.abort();
    }
  }

  function regenerate() {
    const lastUser = [...state.messages]
      .reverse()
      .find((m) => m.role === "user");
    if (lastUser) {
      return send(lastUser.content);
    }
  }

  return {
    send,
    stop,
    regenerate,
    subscribe,
    get messages() {
      return state.messages.slice();
    },
  };
}
