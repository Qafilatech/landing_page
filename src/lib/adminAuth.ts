import {
  clearStoredSessionTokens,
  platformFetch,
  storeSessionTokensFromResponse,
  getApiBase,
} from './platformApi';

export type SuperuserSession = {
  id: string;
  email: string;
  role: string;
  tenantId?: string;
};

type LoginResponse = {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      role: string;
      tenantId: string;
    };
  };
  message?: string;
};

type MeResponse = {
  success: boolean;
  data?: SuperuserSession;
};

/** Operator login against qafila-platform (creates SuperTokens session + role). */
export async function superuserLogin(
  email: string,
  password: string,
): Promise<SuperuserSession> {
  const base = getApiBase();
  const response = await fetch(`${base}/api/v1/auth/superuser/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email: email.trim(), password }),
  });

  storeSessionTokensFromResponse(response);

  const body = (await response.json().catch(() => ({}))) as LoginResponse;
  if (!response.ok || !body.success || !body.data?.user) {
    const message =
      (body as { message?: string }).message ||
      (body as { error?: string }).error ||
      'Login failed';
    throw new Error(message);
  }

  return {
    id: body.data.user.id,
    email: body.data.user.email,
    role: body.data.user.role,
    tenantId: body.data.user.tenantId,
  };
}

/** Confirms the current SuperTokens session is a platform superuser. */
export async function fetchSuperuserMe(): Promise<SuperuserSession | null> {
  try {
    const { data } = await platformFetch<MeResponse>('/api/superuser/me');
    if (!data.success || !data.data?.email) return null;
    if (data.data.role !== 'super_admin' && data.data.role !== 'admin') {
      return null;
    }
    return data.data;
  } catch (e) {
    const err = e as { status?: number };
    if (err.status === 401 || err.status === 403) return null;
    throw e;
  }
}

export async function superuserLogout(): Promise<void> {
  try {
    await platformFetch('/api/v1/auth/logout', { method: 'POST' });
  } catch {
    // Still clear local tokens
  }
  clearStoredSessionTokens();
}
