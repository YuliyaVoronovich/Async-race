import './winners-table.scss';
import { BaseComponent } from '../../../components/base-component';

export class WinnersTable extends BaseComponent {
  private body = new BaseComponent({ tag: 'tbody' });

  private win: BaseComponent;

  private time: BaseComponent;

  constructor(sotrTableWin: (item: string) => void) {
    super({ tag: 'table', className: 'table' });
    const head = new BaseComponent({ tag: 'thead' });
    const headRow = new BaseComponent({ tag: 'tr' });
    const headers = [
      new BaseComponent({ tag: 'th', className: 'thead', textContent: 'Number' }),
      new BaseComponent({ tag: 'th', className: 'thead', textContent: 'Car' }),
      new BaseComponent({ tag: 'th', className: 'thead', textContent: 'Name' }),
      (this.win = new BaseComponent({ tag: 'th', className: 'thead', textContent: 'Wins' })),
      (this.time = new BaseComponent({ tag: 'th', className: 'thead', textContent: 'Best time' })),
    ];

    headRow.appendChildren(headers);
    head.append(headRow);
    this.append(head);
    this.append(this.body);

    this.win.addListener('click', (e: Event) => {
      e.preventDefault();
      sotrTableWin('wins');
    });

    this.time.addListener('click', (e: Event) => {
      e.preventDefault();
      sotrTableWin('time');
    });
  }

  public get bodyNode(): BaseComponent {
    return this.body;
  }
}
