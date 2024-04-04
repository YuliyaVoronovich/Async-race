import { request } from '../app/utils/request';
import { PAGE_LIMIT_GARAGE } from '../app/constants';

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
