if (window.Sentry) {
  window.Sentry.init({
    dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
    integrations: [window.Sentry.replayIntegration()],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 0.1,
  });
}
