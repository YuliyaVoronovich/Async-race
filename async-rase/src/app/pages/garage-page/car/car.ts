import './car.scss';
import type { ICar } from '../../../interfaces/car';
import { BaseComponent } from '../../../components/base-component';
import motoImage from '../../../assets/images/moto.svg?raw';

export class Car extends BaseComponent {
  private carName: BaseComponent;

  private readonly carImage: BaseComponent;

  constructor(car: ICar) {
    super({ tagName: 'div', className: 'car-wrapper-container' });
    const carWrapper = new BaseComponent({ tagName: 'div', className: 'car-wrapper' });
    this.carName = new BaseComponent({ tagName: 'span', className: 'car-name', textContent: car.name });
    this.carImage = new BaseComponent({ tagName: 'div', className: 'car-image' });
    this.carImage.setHTML(motoImage);
    this.carImage.setStyle('fill', car.color);
    carWrapper.appendChildren([this.carName, this.carImage]);
    this.appendChildren([carWrapper]);
  }
}
