import './garage-page.scss';
import '../page.scss';
import { chooseEngine, startDrive } from '../../../api/engine-api';
import { CarService } from '../../sevices/car-service';
import { BaseComponent } from '../../components/base-component';
import { CreateForm } from '../../components/create-form/create-form';
import { CarTrack } from './car-track/car-track';
import { Button } from '../../components/button/button';
import type { ICar } from '../../interfaces/car';
import type { Car } from './car/car';
import { PAGE_LIMIT_GARAGE, START_PAGE } from '../../constants';

enum DriveStatus {
  started = 'started',
  stopped = 'stopped',
  drive = 'drive',
}
export class GaragePage extends BaseComponent {
  private currentPage = 1;

  private countPages = 1;

  private readonly header = new BaseComponent({ tagName: 'h2', className: 'title', textContent: `Garage ()` });

  private readonly pageNumber = new BaseComponent({ tagName: 'h3', className: 'page-number', textContent: `Page #` });

  private readonly form: CreateForm;

  private readonly tracksContainer = new BaseComponent({
    tagName: 'div',
    className: 'garage-tracks',
  });

  private carTracks: CarTrack[] = [];

  private readonly prevButton = new Button({ className: 'control-button prev-button', textContent: 'PREV' });

  private readonly nextButton = new Button({ className: 'control-button next-button', textContent: 'NEXT' });

  private readonly raceAll = new Button({ className: 'control-button start-button', textContent: 'Start All' });

  private readonly resetAll = new Button({ className: 'control-button stop-button', textContent: 'Stop All' });

  private readonly onCarsCountChange: (count: number) => void;

  constructor() {
    super({ tagName: 'div', className: 'garage-wrapper' });
    this.prevButton.addClass('disabled');

    const controlsWrapper = new BaseComponent({ tagName: 'div', className: 'control-button-wrapper' });
    controlsWrapper.appendChildren([this.pageNumber, this.prevButton, this.nextButton]);
    this.form = new CreateForm(this.getFormData, this.getFormDataUpdate, this.randomGenerateCars);
    const wrapper = new BaseComponent({ tagName: 'div', className: 'wrapper' });
    const controlsStartWrapper = new BaseComponent({ tagName: 'div', className: 'control-race-wrapper' });

    controlsStartWrapper.appendChildren([this.raceAll, this.resetAll]);
    wrapper.appendChildren([this.form, controlsStartWrapper]);

    this.onCarsCountChange = (count: number) => {
      this.header.setTextContent(`Garage (${count})`);
      this.countPages = Math.ceil(count / PAGE_LIMIT_GARAGE);
      this.updatePageTitle();
      this.checkNextButton();
    };
    this.createTracks(this.currentPage)
      .then(() => {})
      .catch(() => {});

    CarService.carsCount.subscribe(this.onCarsCountChange);
    this.appendChildren([this.header, controlsWrapper, wrapper, this.tracksContainer]);

    this.nextButton.addListener('click', (e: Event) => {
      e.preventDefault();
      this.checkNextButton();
      this.prevButton.removeClass('disabled');
      this.currentPage += 1;
      this.updatePageTitle();
      this.updateTracks();
    });
    this.prevButton.addListener('click', (e: Event) => {
      e.preventDefault();
      if (this.currentPage === START_PAGE + 1) {
        this.prevButton.addClass('disabled');
      }
      this.nextButton.removeClass('disabled');
      this.currentPage -= 1;
      this.updatePageTitle();
      this.updateTracks();
    });
  }

  private checkNextButton = () => {
    this.nextButton.toggleClass('disabled', this.currentPage === this.countPages);
  };

  private async createTracks(page: number): Promise<void> {
    const cars = await CarService.getCars(page);
    this.carTracks = cars.map(
      (car) =>
        new CarTrack({
          currentCar: car,
          removeCar: this.removeCar,
          updateCar: this.updateCar,
          startAnimateCar: this.startAnimateCar,
          stopAnimateCar: this.stopAnimateCar,
        }),
    );
    this.tracksContainer.appendChildren([...this.carTracks]);
  }

  private updatePageTitle = () => {
    this.pageNumber.setTextContent(`Page #${this.currentPage}`);
  };

  private updateTracks(): void {
    this.tracksContainer.destroyChildren();
    this.createTracks(this.currentPage)
      .then(() => {})
      .catch(() => {});
    this.checkNextButton();
  }

  private getFormData = (name: string, color: string) => {
    CarService.createCar(name, color)
      .then(() => {
        this.updateTracks();
      })
      .catch(() => {});
  };

  private getFormDataUpdate = (id: number, name: string, color: string) => {
    CarService.updateCar(id, name, color)
      .then(() => {
        this.updateTracks();
      })
      .catch(() => {});
  };

  private randomGenerateCars = async (): Promise<void> => {
    return CarService.createCars().then(() => {
      return this.updateTracks();
    });
  };

  private removeCar = (id: number, track: BaseComponent): void => {
    CarService.removeCar(id)
      .then(() => {
        track.destroy();
      })
      .catch(() => {});
  };

  private updateCar = (car: ICar): void => {
    this.form.fullDataOfCar(car);
  };

  private startAnimateCar = async (buttonStart: Button, buttonStop: Button, car: Car): Promise<void> => {
    buttonStart.addClass('disabled');
    buttonStop.removeClass('disabled');
    const { distance, velocity } = await chooseEngine(car.idcar, DriveStatus.started);
    car.startAnimation(`${distance / velocity}ms`);
    startDrive(car.idcar)
      .then((res) => {
        if (!res.success) {
          car.pauseAnimation();
        }
      })
      .catch((error: Error) => {
        return error;
      });
  };

  private stopAnimateCar = async (buttonStart: Button, buttonStop: Button, car: Car): Promise<void> => {
    buttonStart.removeClass('disabled');
    buttonStop.addClass('disabled');
    await chooseEngine(car.idcar, DriveStatus.stopped);
    car.stopAnimation();
  };
}
