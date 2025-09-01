import { onCLS, onLCP, onINP } from 'web-vitals/attribution';

const ANALYTICS_ENDPOINT = '/analytics';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    id: metric.id,
    delta: metric.delta,
    attribution: metric.attribution,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(ANALYTICS_ENDPOINT, body);
  } else {
    fetch(ANALYTICS_ENDPOINT, {
      body,
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
  }
}

onCLS(sendToAnalytics, { reportAllChanges: true });
onLCP(sendToAnalytics, { reportAllChanges: true });
onINP(sendToAnalytics, { reportAllChanges: true });

