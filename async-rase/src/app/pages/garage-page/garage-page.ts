import './garage-page.scss';
import { CarService } from '../../sevices/car-service';
import { BaseComponent } from '../../components/base-component';
import { CreateForm } from '../../components/create-form/create-form';
import { CarTrack } from './car-track/car-track';

export class GaragePage extends BaseComponent {
  private readonly header: BaseComponent;

  private readonly pageNumber: BaseComponent;

  private readonly form: CreateForm;

  private readonly tracksContainer: BaseComponent;

  private carTracks: CarTrack[] = [];

  private readonly currentPage = 1;

  constructor() {
    super({ tagName: 'div', className: 'garage-wrapper' });
    this.header = new BaseComponent({ tagName: 'h2', className: 'title', textContent: `Garage` });
    this.pageNumber = new BaseComponent({ tagName: 'h3', className: 'page-number', textContent: `Page` });
    this.form = new CreateForm(this.getFormData);
    this.tracksContainer = new BaseComponent({
      tagName: 'div',
      className: 'garage-tracks',
    });
    this.createTracks(this.currentPage).catch(() => {});

    this.appendChildren([this.header, this.pageNumber, this.form, this.tracksContainer]);
  }

  private async createTracks(page: number): Promise<void> {
    const cars = await CarService.getCars(page);
    this.carTracks = cars.map((car) => new CarTrack(car));
    this.tracksContainer.appendChildren([...this.carTracks]);
  }

  private updateTracks(): void {
    this.tracksContainer.destroyChildren();
    this.createTracks(this.currentPage).catch(() => {});
  }

  private getFormData = (name: string, color: string) => {
    CarService.createCar(name, color)
      .then(() => {
        this.updateTracks();
      })
      .catch(() => {});
  };
}
