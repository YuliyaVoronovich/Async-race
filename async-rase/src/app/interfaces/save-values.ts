export type ValuesStateCar = {
  currentPage: number;
  values: {
    name: string;
    color: string;
  };
};

export type ValuesStateWins = {
  currentPage: number;
  sort: {
    field: string;
    order: string;
  };
};
