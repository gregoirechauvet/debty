export type BaseOperation<T extends string, K> = {
  eventDate: string;
  operation: T;
  content: K;
};
