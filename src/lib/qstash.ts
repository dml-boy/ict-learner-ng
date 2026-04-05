import { Client } from '@upstash/qstash';

const client = new Client({
  token: process.env.QSTASH_TOKEN || '',
});

/**
 * Pushes a heavy background task to QStash to avoid Vercel/Next.js lambda timeouts.
 * @param url The endpoint to call (e.g., https://your-domain.com/api/ai/generate-module)
 * @param payload The JSON payload
 * @param delay Optional delay in seconds before executing the task
 */
export async function enqueueBackgroundTask(url: string, payload: unknown, delay: number = 0) {
  if (!process.env.QSTASH_TOKEN) {
    console.warn('[QStash] Token missing. Simulating background execution in dev mode...');
    // In dev mode without a token, we might fall back to fetch or fire-and-forget.
    // Ensure you do not await this in the caller route!
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(console.error);
    return { messageId: 'simulated-dev' };
  }

  try {
    const res = await client.publishJSON({
      url,
      body: payload,
      delay,
    });
    return res;
  } catch (error) {
    console.error('[QStash] Failed to enqueue task:', error);
    throw error;
  }
}
