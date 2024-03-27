export interface IWinner {
  id: number;
  wins: number;
  time: number;
}

export interface WinnerResponse {
  items: IWinner[];
  count: string;
}
