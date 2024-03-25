import { createCar, getCars, removeCar, updateCar } from '../../api/car-api';
import type { ICar } from '../interfaces/car';
import Observable from '../utils/observable';

class Car {
  private readonly carCountStart = 0;

  private readonly countIncrement = 1;

  public readonly carsCount = new Observable<number>(this.carCountStart);

  public async getCars(page: number): Promise<ICar[]> {
    const cars = await getCars(page);
    this.carsCount.notify(Number(cars.count));
    return cars.items;
  }

  public getCarsCount(): number {
    return this.carsCount.getValue();
  }

  public async createCar(name: string, color: string): Promise<void> {
    return createCar({ name, color })
      .then(() => {
        this.carsCount.notify((value) => value + this.countIncrement);
      })
      .catch(() => {});
  }

  public async removeCar(id: number): Promise<void> {
    return removeCar(id)
      .then(() => {
        this.carsCount.notify((value) => value - this.countIncrement);
      })
      .catch(() => {});
  }

  public async updateCar(id: number, name: string, color: string): Promise<void> {
    return updateCar(id, { name, color })
      .then(() => {})
      .catch(() => {});
  }
}

export const CarService = new Car();
