import './winners-table.scss';
import { BaseComponent } from '../../../components/base-component';

const headers = [
  new BaseComponent({ tagName: 'th', className: 'thead', textContent: 'Number' }),
  new BaseComponent({ tagName: 'th', className: 'thead', textContent: 'Car' }),
  new BaseComponent({ tagName: 'th', className: 'thead', textContent: 'Name' }),
  new BaseComponent({ tagName: 'th', className: 'thead', textContent: 'Wins' }),
  new BaseComponent({ tagName: 'th', className: 'thead', textContent: 'Best time' }),
];

export class WinnersTable extends BaseComponent {
  private winnersRows: BaseComponent[] = [];

  private body = new BaseComponent({ tagName: 'tbody' });

  constructor() {
    super({ tagName: 'table', className: 'table' });
    const head = new BaseComponent({ tagName: 'thead' });
    const headRow = new BaseComponent({ tagName: 'tr' });
    headRow.appendChildren(headers);
    head.append(headRow);
    this.append(head);
    this.append(this.body);
  }

  public get bodyNode(): BaseComponent {
    return this.body;
  }
}
