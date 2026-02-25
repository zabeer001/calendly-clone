export function getAccessToken() {
    return localStorage.getItem('access_token');
}

export function setAccessToken(token) {
    if (token) {
        localStorage.setItem('access_token', token);
    }
}

export function setRole(role) {
    if (role) {
        localStorage.setItem('role', role);
    }
}

export function clearSession() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
}

function buildHeaders({ auth = false, headers = {}, body }) {
    const merged = {
        Accept: 'application/json',
        ...headers,
    };

    if (!(body instanceof FormData)) {
        merged['Content-Type'] = merged['Content-Type'] || 'application/json';
    }

    if (auth) {
        const token = getAccessToken();
        if (token) {
            merged.Authorization = `Bearer ${token}`;
        }
    }

    return merged;
}

export async function apiRequest(url, options = {}) {
    const { method = 'GET', body, auth = false, headers = {} } = options;

    const response = await fetch(url, {
        method,
        headers: buildHeaders({ auth, headers, body }),
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const message = payload?.message || payload?.error || 'Request failed.';
        const error = new Error(message);
        error.status = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
}

export async function refreshToken() {
    const payload = await apiRequest('/api/refresh', { method: 'POST', auth: true });
    const token = payload?.data?.access_token;

    if (token) {
        setAccessToken(token);
    }

    return payload;
}
