import { apiClient } from "./apiClient";

export async function login({ email, password }) {
    const result = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    if (result.data?.session?.access_token) {
        localStorage.setItem('sb-access-token', result.data.session.access_token);
    }

    return result.data;
}

export async function getCurrentUserApi() {
    const token = localStorage.getItem('sb-access-token');
    if (!token) return null;
    
    // apiClient will automatically throw an error and logout if status is 401/403
    return apiClient('/auth/profile');
}

export async function logoutApi() {
    const token = localStorage.getItem('sb-access-token');
    if (token) {
        try {
            await apiClient('/auth/logout', {
                method: 'POST'
            });
        } catch (err) {
            console.error("Backend logout failed", err);
        }
    }
    localStorage.removeItem('sb-access-token');
}