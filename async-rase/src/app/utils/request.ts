import { baseUrl } from '../constants';

export async function request<T>(
  endpoint: string,
  { body, method, headers }: { body?: object | null; method: string; headers?: HeadersInit } = { method: 'GET' },
): Promise<{ body: T; headers: Headers }> {
  const defaultHeaders = { 'content-type': 'application/json' };
  const config = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  };
  return fetch(`${baseUrl}/${endpoint}`, config).then(async (response) => {
    if (response.ok) {
      return {
        body: (await response.json()) as T,
        headers: response.headers,
      };
    }
    const errorMessage = await response.text();
    return Promise.reject(new Error(errorMessage));
  });
}
