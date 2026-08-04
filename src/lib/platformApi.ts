/** Platform API base (qafila-platform). Override with VITE_API_BASE. */
export function getApiBase(): string {
  const fromEnv = (import.meta.env.VITE_API_BASE as string | undefined)?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, '');
  return 'http://localhost:3001';
}

const ACCESS_TOKEN_KEY = 'qafila_st_access_token';
const ANTI_CSRF_KEY = 'qafila_st_anti_csrf';

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearStoredSessionTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ANTI_CSRF_KEY);
}

export function storeSessionTokensFromResponse(res: Response): void {
  const access =
    res.headers.get('st-access-token') ||
    res.headers.get('St-Access-Token');
  if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);

  const anti =
    res.headers.get('anti-csrf') ||
    res.headers.get('st-anti-csrf-token') ||
    res.headers.get('Anti-Csrf');
  if (anti) localStorage.setItem(ANTI_CSRF_KEY, anti);
}

export type PlatformApiError = {
  status: number;
  error?: string;
  message?: string;
};

export async function platformFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<{ data: T; response: Response }> {
  const base = getApiBase();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getStoredAccessToken();
  if (token) {
    headers.set('st-auth-token', token);
    headers.set('Authorization', `Bearer ${token}`);
  }
  const anti = localStorage.getItem(ANTI_CSRF_KEY);
  if (anti) {
    headers.set('anti-csrf', anti);
  }

  const response = await fetch(url, {
    ...init,
    headers,
    credentials: 'include',
  });

  storeSessionTokensFromResponse(response);

  let body: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { message: text };
    }
  }

  if (!response.ok) {
    const err = (body || {}) as Record<string, unknown>;
    const error: PlatformApiError = {
      status: response.status,
      error: typeof err.error === 'string' ? err.error : undefined,
      message:
        typeof err.message === 'string'
          ? err.message
          : `Request failed (${response.status})`,
    };
    throw error;
  }

  return { data: body as T, response };
}
