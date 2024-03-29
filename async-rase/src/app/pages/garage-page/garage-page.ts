import './garage-page.scss';
import '../page.scss';
import { WinnersService } from '../../sevices/winners-service';
import { chooseEngine, startDrive } from '../../../api/engine-api';
import { CarService } from '../../sevices/car-service';
import { BaseComponent } from '../../components/base-component';
import { CreateForm } from '../../components/create-form/create-form';
import { CarTrack } from './car-track/car-track';
import { Button } from '../../components/button/button';
import type { ICar } from '../../interfaces/car';
import type { Car } from './car/car';
import { PAGE_LIMIT_GARAGE, START_PAGE } from '../../constants';
import { Modal } from '../../components/modal/modal';

enum DriveStatus {
  started = 'started',
  stopped = 'stopped',
  drive = 'drive',
}
const countDecimalPlaces = 2;

export class GaragePage extends BaseComponent {
  private currentPage = CarService.saveValues.currentPage;

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

  private readonly resetAll = new Button({ className: 'control-button stop-button', textContent: 'Reset All' });

  private readonly onCarsCountChange: (count: number) => void;

  private isStop = false;

  private readonly modal = new Modal();

  private readonly countMsInSeconds = 1000;

  constructor() {
    super({ tagName: 'div', className: 'garage-wrapper' });
    this.prevButton.addClass('disabled');
    this.resetAll.addClass('disabled');

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
      this.checkPrevButton();
      this.checkNextButton();
    };
    this.createTracks()
      .then(() => {})
      .catch(() => {});
    CarService.carsCount.subscribe(this.onCarsCountChange);
    this.appendChildren([this.header, controlsWrapper, wrapper, this.tracksContainer, this.modal]);

    this.nextPage();
    this.prevPage();
    this.startAllCars();
    this.stopAllCars();
  }

  private nextPage = () => {
    this.nextButton.addListener('click', (e: Event) => {
      e.preventDefault();
      this.checkNextButton();
      this.prevButton.removeClass('disabled');
      this.currentPage += 1;
      CarService.saveValues.currentPage = this.currentPage;
      this.updatePageTitle();
      this.updateTracks();
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
      CarService.saveValues.currentPage = this.currentPage;
      this.updatePageTitle();
      this.updateTracks();
    });
  };

  private startAllCars = (): void => {
    this.raceAll.addListener('click', (e: Event) => {
      e.preventDefault();
      Promise.any(this.carTracks.map((item) => this.startAnimateCar(item.carTrack, this.raceAll)))
        .then((result) => {
          this.resetAll.removeClass('disabled');
          this.setWinner(result).catch(() => {});
        })
        .catch(() => {
          this.resetAll.removeClass('disabled');
        });
    });
  };

  private stopAllCars = (): void => {
    this.resetAll.addListener('click', (e: Event) => {
      e.preventDefault();
      Promise.all(this.carTracks.map((item) => this.stopAnimateCar(item.carTrack, this.raceAll, this.resetAll)))
        .then(() => {})
        .catch(() => {});
    });
  };

  private checkPrevButton = () => {
    this.prevButton.toggleClass('disabled', this.currentPage === START_PAGE);
  };

  private checkNextButton = () => {
    this.nextButton.toggleClass('disabled', this.currentPage === this.countPages);
  };

  private async createTracks(): Promise<void> {
    const cars = await CarService.getCars(this.currentPage);
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
    this.createTracks()
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

  private randomGenerateCars = (): void => {
    CarService.createCars()
      .then(() => {
        this.updateTracks();
      })
      .catch(() => {});
  };

  private removeCar = (id: number, track: BaseComponent): void => {
    CarService.removeCar(id)
      .then(() => {
        track.destroy();
        WinnersService.removeWinner(id)
          .then(() => {})
          .catch(() => {});
      })
      .catch(() => {});
  };

  private updateCar = (car: ICar): void => {
    this.form.fullDataOfCar(car);
  };

  private startAnimateCar = async (
    car: Car,
    buttonStart?: Button,
    buttonStop?: Button,
  ): Promise<{ id: number; name: string; time: number }> => {
    buttonStart?.addClass('disabled');
    buttonStop?.removeClass('disabled');
    const { distance, velocity } = await chooseEngine(car.idCar, DriveStatus.started);
    car.startAnimation(`${distance / velocity}ms`);
    return new Promise((resolve) => {
      startDrive(car.idCar)
        .then((res) => {
          if (res.success) {
            resolve({
              id: car.idCar,
              name: car.nameCar,
              time: distance / velocity,
            });
          } else {
            car.pauseAnimation();
          }
        })
        .catch((error: string) => {
          throw new Error(error);
        });
    });
  };

  private stopAnimateCar = async (car: Car, buttonStart?: Button, buttonStop?: Button): Promise<void> => {
    buttonStart?.removeClass('disabled');
    buttonStop?.addClass('disabled');
    await chooseEngine(car.idCar, DriveStatus.stopped);
    car.stopAnimation();
  };

  private setWinner(result: { id: number; name: string; time: number }) {
    const time = (result.time / this.countMsInSeconds).toFixed(countDecimalPlaces);
    this.modal.content = `Первым пришёл водитель ${result.name}. Время ${time} s`;
    this.modal.toggleModal();

    return WinnersService.createWinner(result.id, Number(time));
  }
}
