import './car-track.scss';
import type { ICar } from '../../../interfaces/car';
import { BaseComponent } from '../../../components/base-component';
import { Car } from '../car/car';
import { Button } from '../../../components/button/button';

type CarTrackType = {
  currentCar: ICar;
  removeCar: (id: number, track: BaseComponent) => void;
  updateCar: (car: ICar) => void;
  startAnimateCar: (buttonStart: Button, buttonStop: Button, car: Car) => void;
  stopAnimateCar: (buttonStart: Button, buttonStop: Button, car: Car) => void;
};

export class CarTrack extends BaseComponent {
  private readonly car: Car;

  private readonly id: number;

  private readonly updateButton: Button;

  private readonly deleteButton: Button;

  private readonly startButton: Button;

  private readonly stopButton: Button;

  constructor({ currentCar, removeCar, updateCar, startAnimateCar, stopAnimateCar }: CarTrackType) {
    super({ tagName: 'div', className: 'car-track' });
    this.id = currentCar.id;
    this.car = new Car(currentCar);
    this.updateButton = new Button({
      className: 'track-button edit-button',
      textContent: 'E',
      onClick: () => updateCar(currentCar),
    });
    this.deleteButton = new Button({
      className: 'track-button delete-button',
      textContent: 'D',
      onClick: () => removeCar(this.id, this),
    });
    const controls = new BaseComponent({ tagName: 'span', className: 'controls' });
    this.startButton = new Button({
      className: 'track-button start-button',
      textContent: 'Start',
      onClick: () => startAnimateCar(this.startButton, this.stopButton, this.car),
    });
    this.stopButton = new Button({
      className: 'track-button stop-button',
      textContent: 'Stop',
      onClick: () => stopAnimateCar(this.startButton, this.stopButton, this.car),
    });
    this.stopButton.addClass('disabled');
    controls.appendChildren([this.startButton, this.stopButton]);
    this.appendChildren([this.updateButton, this.deleteButton, controls, this.car]);
  }
}
