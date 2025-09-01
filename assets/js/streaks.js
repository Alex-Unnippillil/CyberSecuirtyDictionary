(function () {
  const LOG_KEY = 'activityLog';
  const STATS_KEY = 'streakStats';
  const MS_PER_DAY = 86400000;

  function read(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      return [];
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // ignore storage errors
    }
  }

  function computeStats(log) {
    const days = Array.from(
      new Set(
        log.map((d) =>
          Math.floor(new Date(d).setHours(0, 0, 0, 0) / MS_PER_DAY)
        )
      )
    ).sort((a, b) => a - b);
    if (days.length === 0) {
      return { current: 0, best: 0 };
    }
    let best = 1;
    let streak = 1;
    for (let i = 1; i < days.length; i++) {
      if (days[i] - days[i - 1] === 1) {
        streak++;
      } else {
        streak = 1;
      }
      if (streak > best) {
        best = streak;
      }
    }
    const todayNum = Math.floor(Date.now() / MS_PER_DAY);
    const lastDay = days[days.length - 1];
    const current = lastDay === todayNum ? streak : 0;
    return { current, best };
  }

  function updateDisplay(current, best, newRecord) {
    const currentEl = document.getElementById('current-streak');
    const bestEl = document.getElementById('best-streak');
    if (!currentEl || !bestEl) return;
    currentEl.textContent = String(current);
    bestEl.textContent = String(best);
    if (newRecord && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bestEl.classList.add('celebrate');
      bestEl.addEventListener(
        'animationend',
        () => bestEl.classList.remove('celebrate'),
        { once: true }
      );
    }
  }

  function init() {
    const today = new Date().toISOString().slice(0, 10);
    const log = read(LOG_KEY);
    if (!log.includes(today)) {
      log.push(today);
      log.sort();
      write(LOG_KEY, log);
    }
    const prev = (function () {
      try {
        return JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
      } catch (e) {
        return {};
      }
    })();
    const stats = computeStats(log);
    write(STATS_KEY, stats);
    const newRecord = typeof prev.best === 'number' && stats.best > prev.best;
    updateDisplay(stats.current, stats.best, newRecord);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
