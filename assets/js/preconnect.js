(function () {
  const logger = (typeof window !== "undefined" && window.logger) || console;
  const STORAGE_KEY = "host-usage";
  const MAX_PRECONNECTS = 5;

  function getHost(url) {
    try {
      return new URL(url).origin;
    } catch (e) {
      return null;
    }
  }

  function loadStats() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function saveStats(stats) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      // ignore storage errors
    }
  }

  function preconnectHosts(stats) {
    const entries = Object.entries(stats);
    entries.sort((a, b) => (b[1].count || 0) - (a[1].count || 0));
    const preconnected = [];
    entries.slice(0, MAX_PRECONNECTS).forEach(([host]) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = host;
      link.crossOrigin = "";
      document.head.appendChild(link);
      preconnected.push(host);
      logger.debug("preconnecting to", host);
    });
    return preconnected;
  }

  function logUsage(preconnected) {
    const stats = loadStats();
    const usedHosts = new Set();

    performance.getEntriesByType("resource").forEach((entry) => {
      const host = getHost(entry.name);
      if (!host) return;
      usedHosts.add(host);
      if (!stats[host]) stats[host] = { count: 0, wins: 0, losses: 0 };
      stats[host].count++;
    });

    preconnected.forEach((host) => {
      if (!stats[host]) stats[host] = { count: 0, wins: 0, losses: 0 };
      if (usedHosts.has(host)) {
        stats[host].wins++;
      } else {
        stats[host].losses++;
      }
    });

    saveStats(stats);

    const totals = Object.values(stats).reduce(
      (acc, s) => {
        acc.wins += s.wins || 0;
        acc.losses += s.losses || 0;
        return acc;
      },
      { wins: 0, losses: 0 },
    );
    const totalPreconnects = totals.wins + totals.losses;
    if (totalPreconnects > 0) {
      const efficiency = (totals.wins / totalPreconnects).toFixed(2);
      logger.info(
        `Preconnect efficiency: ${efficiency} (wins: ${totals.wins}, losses: ${totals.losses})`,
      );
    }
  }

  const stats = loadStats();
  const preconnected = preconnectHosts(stats);
  window.addEventListener("load", () => logUsage(preconnected));
})();
