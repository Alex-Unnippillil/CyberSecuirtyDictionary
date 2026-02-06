const routes = ['/', '/search.html', '/diagnostics.html'];
const baseUrl = process.env.DEPLOYMENT_URL;

if (!baseUrl) {
  console.error('DEPLOYMENT_URL not set');
  process.exit(1);
}

async function check(path) {
  const res = await fetch(baseUrl + path);
  if (res.status !== 200) {
    throw new Error(`${path} returned ${res.status}`);
  }
}

Promise.all(routes.map(check))
  .then(() => {
    console.log('Smoke tests passed');
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
