import { GroupState } from "./state";
import { AddMemberOperation, apply } from "./add-member.operation";

describe("AddMemberOperation", () => {
  const operation: AddMemberOperation = {
    eventDate: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
    operation: "AddMember",
    content: {
      id: "09f26a07-b804-4f3e-9073-e4d18e0da9eb",
      name: "Jean-Philippe",
    },
  };

  it("should add member to empty group", () => {
    const state: GroupState = {
      id: "11c2c1f9-1553-4388-967a-3302a69347c1",
    };

    const expected: GroupState = {
      id: "11c2c1f9-1553-4388-967a-3302a69347c1",
      members: {
        "09f26a07-b804-4f3e-9073-e4d18e0da9eb": {
          name: {
            timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "Jean-Philippe",
          },
        },
      },
    };

    const actual = apply(state, operation);

    expect(actual).toEqual(expected);
  });

  it("should add member to existing members", () => {
    const state: GroupState = {
      id: "11c2c1f9-1553-4388-967a-3302a69347c1",
      members: {
        "6021e3e7-6347-43ab-8519-c5f96f6b9a8c": {
          name: {
            timestamp: "2000-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "Matthew",
          },
        },
      },
    };

    const expected: GroupState = {
      id: "11c2c1f9-1553-4388-967a-3302a69347c1",
      members: {
        "6021e3e7-6347-43ab-8519-c5f96f6b9a8c": {
          name: {
            timestamp: "2000-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "Matthew",
          },
        },
        "09f26a07-b804-4f3e-9073-e4d18e0da9eb": {
          name: {
            timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "Jean-Philippe",
          },
        },
      },
    };

    const actual = apply(state, operation);

    expect(actual).toEqual(expected);
  });
});
