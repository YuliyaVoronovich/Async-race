import { BaseComponent } from '../../../components/base-component';
import motoImage from '../../../assets/images/moto1.svg?raw';

export class WinnersTableRow extends BaseComponent {
  constructor(increment: number, name: string, color: string, wins: number, bestTime: number) {
    super({ tag: 'tr', className: 'table-row' });

    const number = new BaseComponent({ tag: 'td', className: 'table-cell', textContent: `${increment}` });
    const carImage = new BaseComponent({ tag: 'td', className: 'table-cell' });
    carImage.setHTML(motoImage);
    carImage.setStyle('fill', color);
    const carName = new BaseComponent({ tag: 'td', className: 'table-cell', textContent: `${name}` });
    const countWins = new BaseComponent({ tag: 'td', className: 'table-cell', textContent: `${wins}` });
    const bestTimeTheCar = new BaseComponent({ tag: 'td', className: 'table-cell', textContent: `${bestTime}` });
    this.appendChildren([number, carImage, carName, countWins, bestTimeTheCar]);
  }
}
