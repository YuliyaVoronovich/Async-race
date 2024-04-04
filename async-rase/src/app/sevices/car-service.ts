import type { ValuesStateCar } from 'src/app/interfaces/save-values';
import { createCar, getCars, removeCar, updateCar, getCar } from '../../api/car-api';
import type { ICar } from '../interfaces/car';
import Observable from '../utils/observable';
import { getRandomName, getRandomColor } from '../utils/random-generate';

class CarService {
  public saveValues: ValuesStateCar = {
    currentPage: 1,
    values: {
      name: '',
      color: '',
    },
  };

  private readonly carCountStart = 0;

  private readonly countIncrement = 1;

  private readonly countCarsForRandom = 100;

  public readonly carsCount = new Observable<number>(this.carCountStart);

  public async getCars(page: number) {
    const cars = await getCars(page);
    this.carsCount.notify(Number(cars.headers.get('X-Total-Count')));
    return cars.body as ICar[];
  }

  public async getCar(page: number) {
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
      .catch((error: Error) => {
        throw new Error(error.message);
      });
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
      .catch((error: Error) => {
        throw new Error(error.message);
      });
  }

  public async updateCar(id: number, name: string, color: string) {
    return updateCar(id, { name, color }).catch((error: Error) => {
      throw new Error(error.message);
    });
  }
}

export const carService = new CarService();
