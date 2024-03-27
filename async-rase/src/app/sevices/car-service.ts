import { createCar, getCars, removeCar, updateCar, getCar } from '../../api/car-api';
import type { ICar } from '../interfaces/car';
import Observable from '../utils/observable';
import { getRandomName, getRandomColor } from '../utils/random-generate';

class Car {
  private readonly carCountStart = 0;

  private readonly countIncrement = 1;

  private readonly countCarsForRandom = 100;

  public readonly carsCount = new Observable<number>(this.carCountStart);

  public async getCars(page: number): Promise<ICar[]> {
    const cars = await getCars(page);
    this.carsCount.notify(Number(cars.count));
    return cars.items;
  }

  public async getCar(page: number): Promise<ICar> {
    const car = await getCar(page);
    return car;
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

  public async createCars(): Promise<void> {
    const requests = Array.from({ length: this.countCarsForRandom }, () =>
      createCar({ name: getRandomName(), color: getRandomColor() }),
    );
    return Promise.all(requests).then(() => {
      this.carsCount.notify((val) => val + this.countCarsForRandom);
    });
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
