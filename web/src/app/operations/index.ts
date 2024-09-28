import { CreateEntryOperation, apply as applyCreateEntryOperation } from "./create-entry.operation";
import { SetEntryAmountOperation, apply as applySetEntryAmountOperation } from "./set-entry-amount.operation";
import { SetGroupNameOperation, apply as applySetGroupNameOperation } from "./set-group-name.operation";
import { AddMemberOperation, apply as applyAddMemberOperation } from "./add-member.operation";
import { GroupState } from "./state";

export type Operation = CreateEntryOperation | SetEntryAmountOperation | SetGroupNameOperation | AddMemberOperation;

export function applyOperationToState(state: GroupState, operation: Operation): GroupState {
  switch (operation.operation) {
    case "CreateEntry":
      return applyCreateEntryOperation(state, operation);
    case "SetEntryAmount":
      return applySetEntryAmountOperation(state, operation);
    case "SetGroupName":
      return applySetGroupNameOperation(state, operation);
    case "AddMember":
      return applyAddMemberOperation(state, operation);
  }

  operation satisfies never;
}
