/**
 * Hardened network layer.
 *  - HTTPS only (http:// is rejected, never silently upgraded)
 *  - Strict host allow-list
 *  - Timeout + no credentials / cookies sent
 *  - Response size + shape validation done by callers
 * Certificate pinning is enforced natively in production builds (see PINNING.md).
 */
const ALLOWED_HOSTS = new Set(['cdn.jsdelivr.net']);

export async function secureFetchJson<T>(url: string, timeoutMs = 20000): Promise<T> {
  let parsed: URL;
  try { parsed = new URL(url); } catch { throw new Error('Invalid URL'); }
  if (parsed.protocol !== 'https:') throw new Error('Blocked: HTTPS required');
  if (!ALLOWED_HOSTS.has(parsed.hostname)) throw new Error('Blocked: host not allowed');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'omit',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}
