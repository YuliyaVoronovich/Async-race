import { getCar } from '../../api/car-api';
import { getWinners, removeWinner, getWinner, createWinner, updateWinner } from '../../api/winner-api';
import type { IWinner } from '../interfaces/winner';
import Observable from '../utils/observable';
import type { ICar } from '../interfaces/car';

class Winners {
  private readonly winnersCountStart = 0;

  private readonly countIncrement = 1;

  public readonly winnersCount = new Observable<number>(this.winnersCountStart);

  public async getWinners(page: number): Promise<(ICar & IWinner)[]> {
    const winners = await getWinners(page);
    this.winnersCount.notify(Number(winners.count));
    return Promise.all(
      winners.items.map(async ({ id, wins, time }: IWinner) => {
        const car = await getCar(id);
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
      .catch(() => {});
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

export const WinnersService = new Winners();
