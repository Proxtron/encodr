const backendURL = import.meta.env.VITE_API_URL;

interface ErrorResponse {
    message: string;
}

export const apiRequest = async <T>(path: string, options: RequestInit = {}) => {
    const url = `${backendURL}${path}`;
    try {
        const response = await fetch(url, {
            ...options,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        if (!response.ok) {
            const body = await response.json() as ErrorResponse;
            throw new Error(body.message);
        }

        return (await response.json()) as T;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Fetch error on ${options.method || 'GET'} ${path}:`, error.message);
        }
        throw error;
    }
};