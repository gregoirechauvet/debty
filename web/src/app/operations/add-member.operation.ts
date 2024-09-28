import { BaseOperation } from "./base.operation";
import { GroupState } from "./state";

export type AddMemberOperation = BaseOperation<"AddMember", { id: string; name: string }>;

export function apply(state: GroupState, operation: AddMemberOperation): GroupState {
  const { members } = state;

  return {
    ...state,
    members: {
      ...members,
      [operation.content.id]: {
        name: {
          timestamp: operation.eventDate,
          value: operation.content.name,
        },
      },
    },
  };
}
