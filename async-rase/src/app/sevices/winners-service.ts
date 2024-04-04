import type { SaveValuesWins } from 'src/types/save-values';
import { getCar } from '../../api/car-api';
import { getWinners, removeWinner, getWinner, createWinner, updateWinner } from '../../api/winner-api';
import type { IWinner } from '../interfaces/winner';
import Observable from '../utils/observable';
import type { ICar } from '../interfaces/car';

class WinnersService {
  public saveValues: SaveValuesWins = {
    currentPage: 1,
    sort: {
      field: '',
      order: '',
    },
  };

  private readonly winnersCountStart = 0;

  private readonly countIncrement = 1;

  public readonly winnersCount = new Observable<number>(this.winnersCountStart);

  public async getWinners(page: number, sort?: string, order?: string): Promise<(ICar & IWinner)[]> {
    const winners = await getWinners(page, sort, order);
    this.winnersCount.notify(Number(winners.count));
    return Promise.all(
      winners.items.map(async ({ id, wins, time }: IWinner) => {
        const car = (await (await getCar(id)).body) as ICar;
        return {
          id,
          name: car.name,
          color: car.color,
          wins,
          time,
        };
      }),
    );
  }

  public getWinnersCount(): number {
    return this.winnersCount.getValue();
  }

  public async removeWinner(id: number): Promise<void> {
    return removeWinner(id)
      .then(() => {
        this.winnersCount.notify((value) => value - this.countIncrement);
      })
      .catch((error: Error) => {
        throw new Error(error.message);
      });
  }

  public async getWinner(page: number): Promise<IWinner> {
    const winner = await getWinner(page);
    return winner;
  }

  public async createWinner(idCar: number, time: number): Promise<void> {
    const result = await getWinner(idCar);
    if (result.id == null) {
      await createWinner({ id: idCar, wins: 1, time });
    } else {
      await updateWinner(idCar, {
        wins: (result.wins += 1),
        time: result.time > time ? time : result.time,
      });
    }
  }
}

export const winnersService = new WinnersService();
