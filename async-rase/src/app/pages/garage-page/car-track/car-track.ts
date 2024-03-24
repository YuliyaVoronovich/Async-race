import './car-track.scss';
import type { ICar } from '../../../interfaces/car';
import { BaseComponent } from '../../../components/base-component';
import { Car } from '../car/car';
import { Button } from '../../../components/button/button';

export class CarTrack extends BaseComponent {
  private readonly car: Car;

  private readonly id: number;

  private readonly updateButton: Button;

  private readonly deleteButton: Button;

  constructor(
    currentCar: ICar,
    removeCalback: (id: number, track: BaseComponent) => void,
    updateCalback: (car: ICar) => void,
  ) {
    super({ tagName: 'div', className: 'car-track' });
    this.id = currentCar.id;
    this.car = new Car(currentCar);
    this.updateButton = new Button({
      className: 'track-button edit-button',
      textContent: 'E',
      onClick: () => updateCalback(currentCar),
    });
    this.deleteButton = new Button({
      className: 'track-button delete-button',
      textContent: 'D',
      onClick: () => removeCalback(this.id, this),
    });
    this.appendChildren([this.updateButton, this.deleteButton, this.car]);
  }
}
