import type { ICar } from '../../../interfaces/car';
import { BaseComponent } from '../../../components/base-component';
import { Car } from '../car/car';

export class CarTrack extends BaseComponent {
  private readonly car: Car;

  constructor(car: ICar) {
    super({ tagName: 'div', className: 'car-track' });
    this.car = new Car(car);
    this.appendChildren([this.car]);
  }
}
