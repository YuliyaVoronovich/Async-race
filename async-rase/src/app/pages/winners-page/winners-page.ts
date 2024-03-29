import '../page.scss';
import { WinnersService } from '../../sevices/winners-service';
import { PAGE_LIMIT_WINNERS, START_PAGE } from '../../constants';
import { Button } from '../../components/button/button';
import { BaseComponent } from '../../components/base-component';
import { WinnersTable } from './winners-table/winners-table';
import { WinnersTableRow } from './winners-table-row/winners-table-row';

export class WinnersPage extends BaseComponent {
  private currentPage = WinnersService.saveValues.currentPage;

  private countPages = 1;

  private readonly header = new BaseComponent({ tagName: 'h2', className: 'title', textContent: `Winners ()` });

  private readonly pageNumber = new BaseComponent({ tagName: 'h3', className: 'page-number', textContent: `Page #` });

  private readonly prevButton = new Button({ className: 'control-button prev-button', textContent: 'PREV' });

  private readonly nextButton = new Button({ className: 'control-button next-button', textContent: 'NEXT' });

  private readonly winnersTable: WinnersTable;

  private readonly onWinnersCountChange: (count: number) => void;

  private winnersRows: WinnersTableRow[] = [];

  private sortOrder = 'ASC';

  constructor() {
    super({ tagName: 'div', className: 'winners-wrapper' });
    this.prevButton.addClass('disabled');
    const controlsWrapper = new BaseComponent({ tagName: 'div', className: 'control-button-wrapper' });
    controlsWrapper.appendChildren([this.pageNumber, this.prevButton, this.nextButton]);
    this.winnersTable = new WinnersTable(this.sortWinner);
    this.appendChildren([this.header, controlsWrapper, this.winnersTable]);

    this.onWinnersCountChange = (count: number) => {
      this.header.setTextContent(`Winners (${count})`);
      this.countPages = Math.ceil(count / PAGE_LIMIT_WINNERS);
      this.updatePageTitle();
      this.checkPrevButton();
      this.checkNextButton();
    };

    WinnersService.winnersCount.subscribe(this.onWinnersCountChange);

    this.createWinners(WinnersService.saveValues.sort.field, WinnersService.saveValues.sort.order)
      .then(() => {})
      .catch(() => {});
    this.nextPage();
    this.prevPage();
  }

  private async createWinners(sort?: string, order?: string): Promise<void> {
    const winners = await WinnersService.getWinners(this.currentPage, sort, order);
    this.winnersRows = winners.map(
      (win, index) =>
        new WinnersTableRow(
          (this.currentPage - 1) * PAGE_LIMIT_WINNERS + index + 1,
          win.name,
          win.color,
          win.wins,
          win.time,
        ),
    );
    this.winnersTable.bodyNode.appendChildren([...this.winnersRows]);
  }

  private updatePageTitle = () => {
    this.pageNumber.setTextContent(`Page #${this.currentPage}`);
  };

  private checkPrevButton = () => {
    this.prevButton.toggleClass('disabled', this.currentPage === START_PAGE);
  };

  private checkNextButton = () => {
    this.nextButton.toggleClass('disabled', this.currentPage === this.countPages);
  };

  private updateTracks(sort?: string, order?: string): void {
    this.winnersTable.bodyNode.destroyChildren();
    this.createWinners(sort, order)
      .then(() => {})
      .catch(() => {});
    this.checkPrevButton();
    this.checkNextButton();
  }

  private nextPage = () => {
    this.nextButton.addListener('click', (e: Event) => {
      e.preventDefault();
      this.checkNextButton();
      this.prevButton.removeClass('disabled');
      this.currentPage += 1;
      WinnersService.saveValues.currentPage = this.currentPage;
      this.updatePageTitle();
      this.updateTracks(WinnersService.saveValues.sort.field, WinnersService.saveValues.sort.order);
    });
  };

  private prevPage = () => {
    this.prevButton.addListener('click', (e: Event) => {
      e.preventDefault();
      if (this.currentPage === START_PAGE + 1) {
        this.prevButton.addClass('disabled');
      }
      this.nextButton.removeClass('disabled');
      this.currentPage -= 1;
      WinnersService.saveValues.currentPage = this.currentPage;
      this.updatePageTitle();
      this.updateTracks(WinnersService.saveValues.sort.field, WinnersService.saveValues.sort.order);
    });
  };

  private sortWinner = (field: string) => {
    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    WinnersService.saveValues.sort.field = field;
    WinnersService.saveValues.sort.order = this.sortOrder;
    this.updateTracks(field, this.sortOrder);
  };
}
