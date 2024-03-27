import { BaseComponent } from '../../../components/base-component';
import motoImage from '../../../assets/images/moto1.svg?raw';

export class WinnersTableRow extends BaseComponent {
  private readonly increment = 0;

  constructor(name: string, color: string, wins: number, bestTime: number) {
    super({ tagName: 'tr', className: 'table-row' });
    this.increment += 1;
    const number = new BaseComponent({ tagName: 'td', className: 'table-cell', textContent: `${this.increment}` });
    const carImage = new BaseComponent({ tagName: 'td', className: 'table-cell' });
    carImage.setHTML(motoImage);
    carImage.setStyle('fill', color);
    const carName = new BaseComponent({ tagName: 'td', className: 'table-cell', textContent: `${name}` });
    const countWins = new BaseComponent({ tagName: 'td', className: 'table-cell', textContent: `${wins}` });
    const bestTimeTheCar = new BaseComponent({ tagName: 'td', className: 'table-cell', textContent: `${bestTime}` });
    this.appendChildren([number, carImage, carName, countWins, bestTimeTheCar]);
  }
}
