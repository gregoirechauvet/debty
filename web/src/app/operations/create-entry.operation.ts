import { GroupState } from "./state";
import { BaseOperation } from "./base.operation";
import { Entry } from "./state";

export type CreateEntryOperation = BaseOperation<"CreateEntry", { id: string; name: string; amount: number }>;

export function apply(state: GroupState, operation: CreateEntryOperation): GroupState {
  const { entries } = state;

  const newEntry: Entry = {
    name: { timestamp: operation.eventDate, value: operation.content.name },
    amount: {
      timestamp: operation.eventDate,
      value: operation.content.amount,
    },
  };

  return {
    ...state,
    entries: { ...entries, [operation.content.id]: newEntry },
  };
}
