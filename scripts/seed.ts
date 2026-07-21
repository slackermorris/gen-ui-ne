// TEMPORARY: seeding only — remove before prod.
//
// Triggers the Worker's temporary /:name/seed endpoint for each demo user,
// replacing their logs with a ~100-record narrative batch.
//
//   1. start the worker:  npm run dev -w gen-ui-ne-server
//   2. seed:              npm run seed
//
// Override the target with SEED_BASE_URL (defaults to local wrangler dev).

const BASE = process.env.SEED_BASE_URL ?? 'http://localhost:8787/gen-ui-ne';
const USERS = ['jack', 'rose', 'robert', 'kennedy'];

async function main() {
  for (const name of USERS) {
    try {
      const res = await fetch(`${BASE}/${name}/seed`, { method: 'POST' });
      const text = await res.text();
      if (res.ok) {
        const { inserted } = JSON.parse(text) as { inserted: number };
        console.log(`✓ ${name.padEnd(8)} seeded ${inserted} logs`);
      } else {
        console.error(`✗ ${name.padEnd(8)} ${res.status}: ${text}`);
      }
    } catch (err) {
      console.error(`✗ ${name.padEnd(8)} request failed:`, err instanceof Error ? err.message : err);
    }
  }
}

main();
