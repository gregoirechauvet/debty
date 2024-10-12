import { apply as applyCreateExpenseOperation, CreateExpenseOperation } from "./create-expense.operation";
import { apply as applySetExpenseAmountOperation, SetExpenseAmountOperation } from "./set-expense-amount.operation";
import { apply as applySetGroupNameOperation, SetGroupNameOperation } from "./set-group-name.operation";
import { AddMemberOperation, apply as applyAddMemberOperation } from "./add-member.operation";
import { GroupState } from "./state";

export type Operation = CreateExpenseOperation | SetExpenseAmountOperation | SetGroupNameOperation | AddMemberOperation;

export function applyOperationToState(state: GroupState, operation: Operation): GroupState {
  switch (operation.operation) {
    case "CreateExpense":
      return applyCreateExpenseOperation(state, operation);
    case "SetExpenseAmount":
      return applySetExpenseAmountOperation(state, operation);
    case "SetGroupName":
      return applySetGroupNameOperation(state, operation);
    case "AddMember":
      return applyAddMemberOperation(state, operation);
  }

  operation satisfies never;
}
