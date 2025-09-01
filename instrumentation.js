export async function register() {
  console.log('instrumentation: server register');
}

export async function onRequest(event) {
  console.log('instrumentation: request start', event?.request?.url);
}

export async function onRequestError(err) {
  console.error('instrumentation: request error', err);
}

export async function onRequestEnd() {
  console.log('instrumentation: request end');
}
