export interface Map {
  [key: string]: string | undefined;
}

export interface Data {
  close: string;
  count: number;
  endTime: {
    microseconds: number;
    seconds: number;
  };
  high: string;
  low: string;
  open: string;
  pair: string;
  startTime: {
    microseconds: number;
    seconds: number;
  };
  volume: string;
  vwap: string;
}

export interface DigitObject {
  value: string;
  isInteger: boolean; // digit is before the decimal point within the number
  change: boolean /* increase, decrese */ | null /* no change */;
}

export type Price = DigitObject[];

export type Currency = "USD" | "GBP";
