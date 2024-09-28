type TimedValue<T> = {
  timestamp: string;
  value: T;
};

export type Entry = {
  name: TimedValue<string>;
  amount: TimedValue<number>;
};

export type Member = {
  name: TimedValue<string>;
};

export type GroupState = {
  id: string;
  name?: TimedValue<string>;
  entries?: { [id: string]: Entry };
  members?: { [id: string]: Member };
};
