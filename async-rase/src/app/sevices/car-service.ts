import { createCar, getCars, removeCar } from '../../api/car-api';
import type { ICar } from '../interfaces/car';

class Car {
  private carsCount = '0';

  public async getCars(page: number): Promise<ICar[]> {
    const cars = await getCars(page);
    this.carsCount = cars.count;
    console.log(this.carsCount);
    return cars.items;
  }

  public getCarsCount(): string {
    return this.carsCount;
  }

  public async createCar(name: string, color: string): Promise<void> {
    return createCar({ name, color })
      .then(() => {})
      .catch(() => {});
  }

  public async removeCar(id: number): Promise<void> {
    return removeCar(id)
      .then(() => {})
      .catch(() => {});
  }
}

export const CarService = new Car();
