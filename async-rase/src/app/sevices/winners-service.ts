import { getCar } from '../../api/car-api';
import { getWinners, removeWinner } from '../../api/winner-api';
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
}

export const WinnersService = new Winners();
