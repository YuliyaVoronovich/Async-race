import { request } from '../app/utils/request';
import { PAGE_LIMIT_WINNERS } from '../app/constants';

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

export async function getWinner(id: number) {
  return request(`winners/${id}`);
}
