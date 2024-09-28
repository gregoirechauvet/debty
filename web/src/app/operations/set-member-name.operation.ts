import { BaseOperation } from "./base.operation";
import { GroupState, Member } from "./state";

export type SetMemberNameOperation = BaseOperation<"SetMemberName", { memberId: string; name: string }>;

export function apply(state: GroupState, operation: SetMemberNameOperation): GroupState {
  const { members } = state;
  const member = members?.[operation.content.memberId];
  if (member === undefined || member.name.timestamp > operation.eventDate) {
    return state;
  }

  const updatedMember: Member = {
    name: {
      timestamp: operation.eventDate,
      value: operation.content.name,
    },
  };

  return {
    ...state,
    members: { ...members, [operation.content.memberId]: updatedMember },
  };
}
