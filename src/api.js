const BASE = import.meta.env.VITE_API_URL;
export const apiFetch = async (
    endpoint,
    options = {},
    accessToken,
    setAccessToken
) => {
    const makeRequest = (token) => {
        const headers = new Headers(options.headers || {});
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return fetch(`${BASE}${endpoint}`, {
            ...options,
            headers,
            credentials: "include",
        });
    };
    let response = await makeRequest(accessToken);
    if (response.status !== 401) {
        return response;
    }
    const refreshResponse = await fetch(`${BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
    });
    if (!refreshResponse.ok) {
        setAccessToken(null);
        return response;
    }
    const refreshData = await refreshResponse.json();
    const newAccessToken = refreshData.accessToken;
    setAccessToken(newAccessToken);
    response = await makeRequest(newAccessToken);
    return response;
};

export default BASE;