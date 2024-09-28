import { BaseOperation } from "./base.operation";
import { GroupState } from "./state";

export type SetEntryAmountOperation = BaseOperation<"SetEntryAmount", { entryId: string; amount: number }>;

export function apply(state: GroupState, operation: SetEntryAmountOperation): GroupState {
  const { entries } = state;
  const entry = entries?.[operation.content.entryId];
  if (entry === undefined || entry.amount.timestamp > operation.eventDate) {
    return state;
  }

  const updatedEntry = {
    ...entry,
    amount: {
      timestamp: operation.eventDate,
      value: operation.content.amount,
    },
  };

  return {
    ...state,
    entries: { ...entries, [operation.content.entryId]: updatedEntry },
  };
}
