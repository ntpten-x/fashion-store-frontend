const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function apiClient(endpoint, options = {}) {
    const token = localStorage.getItem('sb-access-token');

    const isFormData = options.body instanceof FormData;
    const headers = {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
    };

    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

    const response = await fetch(url, config);

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('sb-access-token');

            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        let errorMessage = `Request failed with status ${response.status}`;
        try {
            const errorData = await response.json();
            if (errorData.message) {
                errorMessage = Array.isArray(errorData.message)
                    ? errorData.message.join(', ')
                    : errorData.message;
            }
        } catch (e) {
            // Ignore if response is not JSON
        }
        throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    }
    return await response.text();
}
