const backendURL = import.meta.env.VITE_API_URL;

export const apiRequest = async <T>(path: string, options: RequestInit = {}) => {
    const url = `${backendURL}${path}`;
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        // Return empty object for "204 No Content" responses (common in DELETE)
        if (response.status === 204) return {} as T;

        return (await response.json()) as T;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Fetch error on ${options.method || 'GET'} ${path}:`, error.message);
        }
        throw error;
    }
};