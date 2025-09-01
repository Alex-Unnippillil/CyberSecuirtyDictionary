import fs from 'fs/promises';
import path from 'path';
import webpush from 'web-push';

const SUBS_FILE = path.join(process.cwd(), 'data', 'subscriptions.json');

webpush.setVapidDetails(
  'mailto:admin@example.com',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

async function readSubs(): Promise<any[]> {
  try {
    const data = await fs.readFile(SUBS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeSubs(subs: any[]): Promise<void> {
  await fs.writeFile(SUBS_FILE, JSON.stringify(subs, null, 2));
}

export async function addSubscription(sub: any): Promise<void> {
  const subs = await readSubs();
  if (!subs.find((s) => s.endpoint === sub.endpoint)) {
    subs.push(sub);
    await writeSubs(subs);
  }
}

export async function removeSubscription(sub: any): Promise<void> {
  const subs = await readSubs();
  const filtered = subs.filter((s) => s.endpoint !== sub.endpoint);
  await writeSubs(filtered);
}

export async function broadcastUpdate(payload: unknown): Promise<void> {
  const subs = await readSubs();
  await Promise.all(
    subs.map((sub) =>
      webpush.sendNotification(sub, JSON.stringify(payload)).catch((err) => {
        // Clean up subscriptions that are no longer valid
        if (err.statusCode === 410 || err.statusCode === 404) {
          return removeSubscription(sub);
        }
      })
    )
  );
}

// Helper used by term update workflow
export async function broadcastTermChange(term: string): Promise<void> {
  await broadcastUpdate({
    title: 'Dictionary updated',
    body: `${term} was added or modified`,
    url: `/index.html#${encodeURIComponent(term)}`,
  });
}
