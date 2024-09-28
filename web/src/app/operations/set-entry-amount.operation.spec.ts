import { GroupState } from "./state";
import { apply, SetEntryAmountOperation } from "./set-entry-amount.operation";

describe("SetEntryAmount", () => {
  const operation: SetEntryAmountOperation = {
    eventDate: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
    operation: "SetEntryAmount",
    content: {
      entryId: "737be6ac-ed95-4065-bfb2-e69476b255f5",
      amount: 300,
    },
  };

  it("should discard operation if entry does not exist", () => {
    const state: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
    };

    const expected: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
    };

    const actual = apply(state, operation);

    expect(actual).toEqual(expected);
  });

  it("should set amount of existing entry", () => {
    const state: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      entries: {
        "737be6ac-ed95-4065-bfb2-e69476b255f5": {
          name: {
            timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "Burger King",
          },
          amount: {
            timestamp: "2000-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: 200,
          },
        },
      },
    };

    const expected: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      entries: {
        "737be6ac-ed95-4065-bfb2-e69476b255f5": {
          name: {
            timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "Burger King",
          },
          amount: {
            timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: 300,
          },
        },
      },
    };

    const actual = apply(state, operation);

    expect(actual).toEqual(expected);
  });

  it("should discard operation if older than current state", () => {
    const state: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      entries: {
        "737be6ac-ed95-4065-bfb2-e69476b255f5": {
          name: {
            timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "Burger King",
          },
          amount: {
            timestamp: "2002-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: 200,
          },
        },
      },
    };

    const expected: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      entries: {
        "737be6ac-ed95-4065-bfb2-e69476b255f5": {
          name: {
            timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "Burger King",
          },
          amount: {
            timestamp: "2002-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: 200,
          },
        },
      },
    };

    const actual = apply(state, operation);

    expect(actual).toEqual(expected);
  });
});
