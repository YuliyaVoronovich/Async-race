import type { CarResponse, ICar } from '../app/interfaces/car';
import { PAGE_LIMIT_ITMES_GARAGE, baseUrl } from '../app/constants';

const GARAGE_URL = `${baseUrl}/garage`;

export async function getCars(page: number, limit = PAGE_LIMIT_ITMES_GARAGE): Promise<CarResponse> {
  const response = await fetch(`${GARAGE_URL}?_page=${page}&_limit=${limit}`);
  return {
    items: (await response.json()) as ICar[],
    count: response.headers.get('X-Total-Count') ?? '0',
  };
}

export async function getCar(id: number): Promise<ICar> {
  const response = await fetch(`${GARAGE_URL}/${id}`);
  return response.json() as Promise<ICar>;
}
