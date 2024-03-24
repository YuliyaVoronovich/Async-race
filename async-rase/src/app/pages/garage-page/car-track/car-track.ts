import './car-track.scss';
import type { ICar } from '../../../interfaces/car';
import { BaseComponent } from '../../../components/base-component';
import { Car } from '../car/car';
import { Button } from '../../../components/button/button';
import { CarService } from '../../../sevices/car-service';

export class CarTrack extends BaseComponent {
  private readonly car: Car;

  private readonly id: number;

  private readonly updateButton: Button;

  private readonly deleteButton: Button;

  constructor(car: ICar) {
    super({ tagName: 'div', className: 'car-track' });
    this.id = car.id;
    this.car = new Car(car);
    this.updateButton = new Button({ className: 'track-button edit-button', textContent: 'E' });
    this.deleteButton = new Button({
      className: 'track-button delete-button',
      textContent: 'D',
      onClick: this.removeCar,
    });
    this.appendChildren([this.updateButton, this.deleteButton, this.car]);
  }

  private removeCar = (): void => {
    CarService.removeCar(this.id)
      .then(() => {
        this.destroy();
      })
      .catch(() => {});
  };
}
