export type SaveValuesCar = {
  currentPage: number;
  values: {
    name: string;
    color: string;
  };
};

export type SaveValuesWins = {
  currentPage: number;
  sort: {
    field: string;
    order: string;
  };
};
