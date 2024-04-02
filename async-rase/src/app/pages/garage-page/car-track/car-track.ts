import './car-track.scss';
import type { ICar } from '../../../interfaces/car';
import { BaseComponent } from '../../../components/base-component';
import { Car } from '../car/car';
import { Button } from '../../../components/button/button';

type CarTrackType = {
  currentCar: ICar;
  removeCar: (id: number, track: BaseComponent) => void;
  updateCar: (car: ICar) => void;
  startAnimateCar: (
    car: Car,
    buttonStart?: Button,
    buttonStop?: Button,
  ) => Promise<{ id: number; name: string; time: number }>;
  stopAnimateCar: (car: Car, buttonStart?: Button, buttonStop?: Button) => Promise<void>;
};

export class CarTrack extends BaseComponent {
  private readonly car: Car;

  private readonly id: number;

  private readonly updateButton: Button;

  private readonly deleteButton: Button;

  private readonly startButton: Button;

  private readonly stopButton: Button;

  constructor({ currentCar, removeCar, updateCar, startAnimateCar, stopAnimateCar }: CarTrackType) {
    super({ tag: 'div', className: 'car-track' });
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
    const controls = new BaseComponent({ tag: 'span', className: 'controls' });
    this.startButton = new Button({
      className: 'track-button start-button',
      textContent: 'Start',
      onClick: () => {
        startAnimateCar(this.car, this.startButton, this.stopButton).catch((error: Error) => {
          throw new Error(error.message);
        });
      },
    });
    this.stopButton = new Button({
      className: 'track-button stop-button',
      textContent: 'Stop',
      onClick: () => {
        stopAnimateCar(this.car, this.startButton, this.stopButton).catch((error: Error) => {
          throw new Error(error.message);
        });
      },
    });
    this.stopButton.addClass('disabled');
    controls.appendChildren([this.startButton, this.stopButton]);
    this.appendChildren([this.updateButton, this.deleteButton, controls, this.car]);
  }

  public get carTrack() {
    return this.car;
  }
}
