import type { IWinner, WinnerResponse } from '../app/interfaces/winner';
import { PAGE_LIMIT_WINNERS, baseUrl } from '../app/constants';

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
      return {} as WinnerResponse;
    }
    if (response.ok) {
      return {
        items: (await response.json()) as IWinner[],
        count: response.headers.get('X-Total-Count') ?? '0',
      };
    }
    const errorMessage = await response.text();
    return Promise.reject(new Error(errorMessage));
  });
}

export function getWinners(page: number, sort = 'id', order = 'ASC', limit = PAGE_LIMIT_WINNERS) {
  return request(`winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`);
}

export function createWinner(body: { id: number; time: number; wins: number }) {
  return request('winners', { body, method: 'POST' });
}

export function removeWinner(id: number) {
  return request(`winners/${id}`, { method: 'DELETE' });
}

export function updateWinner(id: number, body: { time: number; wins: number }) {
  return request(`winners/${id}`, {
    body,
    method: 'PUT',
  });
}

export async function getWinner(id: number): Promise<IWinner> {
  const response = await fetch(`${baseUrl}/winners/${id}`);
  return response.json() as Promise<IWinner>;
}
