import { GroupState } from "./state";
import { apply, SetGroupNameOperation } from "./set-group-name.operation";

describe("SetGroupNameOperation", () => {
  it("should set group name when missing", () => {
    const state: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
    };

    const operation: SetGroupNameOperation = {
      eventDate: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
      operation: "SetGroupName",
      content: {
        name: "Jacky & friends",
      },
    };

    const expected: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      name: {
        timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
        value: "Jacky & friends",
      },
    };

    const actual = apply(state, operation);

    expect(actual).toEqual(expected);
  });

  it("should set group name when more recent", () => {
    const state: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      name: {
        timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
        value: "Jacky & friends",
      },
    };

    const operation: SetGroupNameOperation = {
      eventDate: "2002-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
      operation: "SetGroupName",
      content: {
        name: "RIP Jacky",
      },
    };

    const expected: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      name: {
        timestamp: "2002-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
        value: "RIP Jacky",
      },
    };

    const actual = apply(state, operation);

    expect(actual).toEqual(expected);
  });

  it("should discard set group name when older", () => {
    const state: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      name: {
        timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
        value: "Jacky & friends",
      },
    };

    const operation: SetGroupNameOperation = {
      eventDate: "2000-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
      operation: "SetGroupName",
      content: {
        name: "New group with Jacky",
      },
    };

    const expected: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      name: {
        timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
        value: "Jacky & friends",
      },
    };

    const actual = apply(state, operation);

    expect(actual).toEqual(expected);
  });
});
