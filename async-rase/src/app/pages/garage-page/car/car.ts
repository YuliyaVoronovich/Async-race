import './car.scss';
import type { ICar } from '../../../interfaces/car';
import { BaseComponent } from '../../../components/base-component';
import motoImage from '../../../assets/images/moto1.svg?raw';

export class Car extends BaseComponent {
  private carName: BaseComponent;

  private id: number;

  private readonly carImage: BaseComponent;

  constructor(car: ICar) {
    super({ tagName: 'div', className: 'car-wrapper-container' });
    this.id = car.id;
    const carWrapper = new BaseComponent({ tagName: 'div', className: 'car-wrapper' });
    this.carName = new BaseComponent({ tagName: 'span', className: 'car-name', textContent: car.name });
    this.carImage = new BaseComponent({ tagName: 'div', className: 'car-image' });
    this.carImage.setHTML(motoImage);
    this.carImage.setStyle('fill', car.color);
    carWrapper.appendChildren([this.carName, this.carImage]);
    this.appendChildren([carWrapper]);
  }

  public get idcar() {
    return this.id;
  }

  public startAnimation(duration: string): void {
    this.carImage.setStyle('animation', `move`);
    this.carImage.setStyle('animation-duration', duration);
    this.carImage.setStyle('animation-play-state', 'running');
    this.carImage.setStyle('animation-fill-mode', 'forwards');
  }

  public stopAnimation(): void {
    this.carImage.deleteStyle('animation');
  }

  public pauseAnimation(): void {
    this.carImage.deleteStyle('animation-play-state');
    this.carImage.setStyle('animation-play-state', 'paused');
  }
}
