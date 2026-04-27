const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * A simple wrapper around fetch to handle common API logic.
 * @param endpoint The API endpoint to call.
 * @param options Fetch options.
 * @returns The parsed JSON response.
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables");
  }
  const url = `${API_BASE_URL}${endpoint}`;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    ...options?.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  } as HeadersInit;

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      // Redirect to login if unauthorized and client-side
      window.location.href = "/login";
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `API request failed with status ${response.status}`,
    );
  }

  // Handle empty bodies for 204 No Content or similar
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

export function getApiBaseUrl(): string | undefined {
  return API_BASE_URL;
}

export function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}
