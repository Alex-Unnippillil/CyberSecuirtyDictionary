const { expect } = require('chai');
const makeServiceWorkerEnv = require('service-worker-mock');

describe('service worker', () => {
  beforeEach(() => {
    const env = makeServiceWorkerEnv();
    delete env.navigator;
    Object.assign(global, env);
    // successful fetch used during install
    global.fetch = () => Promise.resolve(new Response('ok'));
    delete require.cache[require.resolve('../sw.js')];
    require('../sw.js');
  });

  it('caches core assets on install', async () => {
    await self.trigger('install');
    const cache = await caches.open('cyber-dictionary-v1');
    const requests = await cache.keys();
    const urls = requests.map(req => new URL(req.url).pathname);
    expect(urls).to.include('/index.html');
    expect(urls).to.include('/styles.css');
  });

  it('provides cached content for offline use', async () => {
    await self.trigger('install');
    const cache = await caches.open('cyber-dictionary-v1');
    const keys = await cache.keys();
    const indexReq = keys.find(req => req.url.endsWith('/index.html'));
    const res = await caches.match(indexReq);
    expect(res).to.not.equal(undefined);
    const text = await res.text();
    expect(text).to.equal('ok');
  });

  it('cleans up old caches on activate', async () => {
    await self.trigger('install');
    await caches.open('old-cache');
    await self.trigger('activate');
    const keys = await caches.keys();
    expect(keys).to.include('cyber-dictionary-v1');
    expect(keys).to.not.include('old-cache');
  });
});
