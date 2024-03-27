import '../page.scss';
import { WinnersService } from '../../sevices/winners-service';
import { PAGE_LIMIT_WINNERS } from '../../constants';
import { Button } from '../../components/button/button';
import { BaseComponent } from '../../components/base-component';
import { WinnersTable } from './winners-table/winners-table';
import { WinnersTableRow } from './winners-table-row/winners-table-row';

export class WinnersPage extends BaseComponent {
  private currentPage = 1;

  private countPages = 1;

  private readonly header = new BaseComponent({ tagName: 'h2', className: 'title', textContent: `Winners ()` });

  private readonly pageNumber = new BaseComponent({ tagName: 'h3', className: 'page-number', textContent: `Page #` });

  private readonly prevButton = new Button({ className: 'control-button prev-button', textContent: 'PREV' });

  private readonly nextButton = new Button({ className: 'control-button next-button', textContent: 'NEXT' });

  private readonly winnersTable = new WinnersTable();

  private readonly onWinnersCountChange: (count: number) => void;

  constructor() {
    super({ tagName: 'div', className: 'winners-wrapper' });
    this.prevButton.addClass('disabled');

    const controlsWrapper = new BaseComponent({ tagName: 'div', className: 'control-button-wrapper' });
    controlsWrapper.appendChildren([this.pageNumber, this.prevButton, this.nextButton]);
    this.appendChildren([this.header, controlsWrapper, this.winnersTable]);

    this.onWinnersCountChange = (count: number) => {
      this.header.setTextContent(`Winners (${count})`);
      this.countPages = Math.ceil(count / PAGE_LIMIT_WINNERS);
    };

    WinnersService.winnersCount.subscribe(this.onWinnersCountChange);

    this.createWinners(this.currentPage)
      .then(() => {})
      .catch(() => {});
  }

  private async createWinners(page: number): Promise<void> {
    const winners = await WinnersService.getWinners(page);
    const winnersRows = winners.map((win) => new WinnersTableRow(win.name, win.color, win.wins, win.time));
    this.winnersTable.bodyNode.appendChildren([...winnersRows]);
  }
}
