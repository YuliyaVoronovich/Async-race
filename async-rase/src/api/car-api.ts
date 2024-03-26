import type { CarResponse, ICar } from '../app/interfaces/car';
import { PAGE_LIMIT_GARAGE, baseUrl } from '../app/constants';

async function request(
  endpoint: string,
  { body, method, headers }: { body?: object | null; method: string; headers?: HeadersInit } = { method: 'GET' },
) {
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
    if (response.status === 404) {
      return {} as CarResponse;
    }
    if (response.ok) {
      return {
        items: (await response.json()) as ICar[],
        count: response.headers.get('X-Total-Count') ?? '0',
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

export function getCar(id: number) {
  return request(`garage/${id}`, { method: 'GET' });
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

// export async function getCars(page: number, limit = PAGE_LIMIT_ITMES_GARAGE): Promise<CarResponse> {
//   const response = await fetch(`${GARAGE_URL}?_page=${page}&_limit=${limit}`);

//   return {
//     items: (await response.json()) as ICar[],
//     count: response.headers.get('X-Total-Count') ?? '0',
//   };
// }
