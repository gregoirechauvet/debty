import { Expense, GroupState } from "./state";
import { BaseOperation } from "./base.operation";

export type CreateExpenseOperation = BaseOperation<
  "CreateExpense",
  { id: string; name: string; amount: number; date: string }
>;

export function apply(state: GroupState, operation: CreateExpenseOperation): GroupState {
  const { expenses } = state;

  const newExpense: Expense = {
    label: { timestamp: operation.eventDate, value: operation.content.name },
    amount: {
      timestamp: operation.eventDate,
      value: operation.content.amount,
    },
    date: {
      timestamp: operation.eventDate,
      value: operation.content.date,
    },
  };

  return {
    ...state,
    expenses: { ...expenses, [operation.content.id]: newExpense },
  };
}
