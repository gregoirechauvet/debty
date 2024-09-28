type TimedValue<T> = {
  timestamp: string;
  value: T;
};

export type Expense = {
  label: TimedValue<string>;
  amount: TimedValue<number>;
  date: TimedValue<string>;
};

export type Member = {
  name: TimedValue<string>;
};

export type GroupState = {
  id: string;
  name?: TimedValue<string>;
  expenses?: { [id: string]: Expense };
  members?: { [id: string]: Member };
};
