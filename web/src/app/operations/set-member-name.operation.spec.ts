import { GroupState } from "./state";
import { apply, SetMemberNameOperation } from "./set-member-name.operation";

describe("SetMemberNameOperation", () => {
  const operation: SetMemberNameOperation = {
    eventDate: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
    operation: "SetMemberName",
    content: {
      memberId: "8fa9fa88-0f51-4759-b9db-6c0535f3b82a",
      name: "Bobby",
    },
  };

  it("should discard operation if member does not exist", () => {
    const state: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
    };

    const expected: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
    };

    const actual = apply(state, operation);

    expect(actual).toEqual(expected);
  });

  it("should set member name if operation is more recent", () => {
    const state: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      members: {
        "8fa9fa88-0f51-4759-b9db-6c0535f3b82a": {
          name: {
            timestamp: "2000-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "Bob",
          },
        },
      },
    };

    const expected: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      members: {
        "8fa9fa88-0f51-4759-b9db-6c0535f3b82a": {
          name: {
            timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "Bobby",
          },
        },
      },
    };

    const actual = apply(state, operation);

    expect(actual).toEqual(expected);
  });

  it("should discard set member name if operation is older", () => {
    const state: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      name: {
        timestamp: "2002-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
        value: "Bob 🤘",
      },
    };

    const expected: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      name: {
        timestamp: "2002-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
        value: "Bob 🤘",
      },
    };

    const actual = apply(state, operation);

    expect(actual).toEqual(expected);
  });
});
