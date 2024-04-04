import { PAGE_LIMIT_GARAGE, baseUrl } from '../app/constants';

async function request<T>(
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

export function getCars(page: number, limit = PAGE_LIMIT_GARAGE) {
  return request(`garage?_page=${page}&_limit=${limit}`);
}

export function createCar(body: { name: string; color: string }) {
  return request('garage', { body, method: 'POST' });
}

export function removeCar(id: number) {
  return request(`garage/${id}`, { method: 'DELETE' });
}

export function updateCar(id: number, body: { name: string; color: string }) {
  return request(`garage/${id}`, {
    body,
    method: 'PUT',
  });
}

export function getCar(id: number) {
  return request(`garage/${id}`);
}
