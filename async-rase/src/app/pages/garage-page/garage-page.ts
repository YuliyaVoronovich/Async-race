import './garage-page.scss';
import { chooseEngine, startDrive } from '../../../api/engine-api';
import { CarService } from '../../sevices/car-service';
import { BaseComponent } from '../../components/base-component';
import { CreateForm } from '../../components/create-form/create-form';
import { CarTrack } from './car-track/car-track';
import { Button } from '../../components/button/button';
import type { ICar } from '../../interfaces/car';
import type { Car } from './car/car';

enum DriveStatus {
  started = 'started',
  stopped = 'stopped',
  drive = 'drive',
}
export class GaragePage extends BaseComponent {
  private readonly header = new BaseComponent({ tagName: 'h2', className: 'title', textContent: `Garage ()` });

  private readonly pageNumber = new BaseComponent({ tagName: 'h3', className: 'page-number', textContent: `Page #1` });

  private readonly form: CreateForm;

  private readonly tracksContainer: BaseComponent;

  private carTracks: CarTrack[] = [];

  private readonly currentPage = 1;

  private readonly prevButton = new Button({ className: 'control-button prev-button', textContent: 'PREV' });

  private readonly nextButton = new Button({ className: 'control-button next-button', textContent: 'NEXT' });

  private readonly onCarsCountChange: (count: number) => void;

  constructor() {
    super({ tagName: 'div', className: 'garage-wrapper' });
    const controlsWrapper = new BaseComponent({ tagName: 'div', className: 'control-button-wrapper' });
    controlsWrapper.appendChildren([this.pageNumber, this.prevButton, this.nextButton]);
    this.form = new CreateForm(this.getFormData, this.getFormDataUpdate, this.randomGenerateCars);
    this.onCarsCountChange = (count: number) => {
      this.header.setTextContent(`Garage (${count})`);
    };
    this.tracksContainer = new BaseComponent({
      tagName: 'div',
      className: 'garage-tracks',
    });
    this.createTracks(this.currentPage)
      .then(() => {})
      .catch(() => {});

    CarService.carsCount.subscribe(this.onCarsCountChange);
    this.appendChildren([this.header, controlsWrapper, this.form, this.tracksContainer]);
  }

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

  private updateTracks(): void {
    this.tracksContainer.destroyChildren();
    this.createTracks(this.currentPage)
      .then(() => {})
      .catch(() => {});
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

  private startAnimateCar = async (car: Car): Promise<void> => {
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

  private stopAnimateCar = async (car: Car): Promise<void> => {
    await chooseEngine(car.idcar, DriveStatus.stopped);
    car.stopAnimation();
  };
}
