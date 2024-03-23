export interface ICar {
  id: number;
  name: string;
  color: string;
}

export interface CarResponse {
  items: ICar[];
  count: string;
}
