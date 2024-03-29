const NUMERIC_HEXADECIMAL = 16;
const subStrStart = 2;
const subStrFinish = 8;

const nameCar = [
  'Suzuki',
  'BMW',
  'Honda',
  'Yamaha',
  'Harley-Davidson',
  'Stels',
  'Ducati',
  'Can-Am',
  'Moto Guzzi',
  'Derbi',
];
const secondNameCar = ['Limited', 'Special', 'Senda', 'Sport', 'Cross', 'Super', 'Classic', 'Ultra', 'King', 'Deluxe'];

function getRandomValue(length: number): number {
  return Math.floor(Math.random() * length);
}

export function getRandomName(): string {
  return `${nameCar[getRandomValue(nameCar.length)]}  ${secondNameCar[getRandomValue(secondNameCar.length)]}`;
}

export function getRandomColor(): string {
  return `#${`${Math.random().toString(NUMERIC_HEXADECIMAL)}000000`.substring(subStrStart, subStrFinish)}`;
}
