import {BaseOperation} from "./base.operation";
import {GroupState} from "./state";

export type SetGroupNameOperation = BaseOperation<"SetGroupName", { name: string }>

export function apply(state: GroupState, operation: SetGroupNameOperation): GroupState {
  if (state.name !== undefined && state.name.timestamp > operation.eventDate) {
    return state;
  }

  return {
    ...state,
    name: { timestamp: operation.eventDate, value: operation.content.name }
  }
}