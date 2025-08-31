(function (global) {
  const ANALYTICS_URL =
    global.analyticsEndpoint || "https://example.com/analytics";

  function sendAnalyticsEvent(eventName) {
    const payload = { event: eventName, timestamp: Date.now() };
    const body = JSON.stringify(payload);
    try {
      if (
        global.navigator &&
        typeof global.navigator.sendBeacon === "function"
      ) {
        global.navigator.sendBeacon(ANALYTICS_URL, body);
        return Promise.resolve();
      }
      return fetch(ANALYTICS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  global.sendAnalyticsEvent = sendAnalyticsEvent;
  if (typeof module !== "undefined") {
    module.exports = { sendAnalyticsEvent };
  }
})(typeof self !== "undefined" ? self : this);
