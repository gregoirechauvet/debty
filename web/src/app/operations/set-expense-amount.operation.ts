import { BaseOperation } from "./base.operation";
import { GroupState } from "./state";

export type SetExpenseAmountOperation = BaseOperation<"SetExpenseAmount", { expenseId: string; amount: number }>;

export function apply(state: GroupState, operation: SetExpenseAmountOperation): GroupState {
  const { expenses } = state;
  const expense = expenses?.[operation.content.expenseId];
  if (expense === undefined || expense.amount.timestamp > operation.eventDate) {
    return state;
  }

  const updatedExpense = {
    ...expense,
    amount: {
      timestamp: operation.eventDate,
      value: operation.content.amount,
    },
  };

  return {
    ...state,
    expenses: { ...expenses, [operation.content.expenseId]: updatedExpense },
  };
}
