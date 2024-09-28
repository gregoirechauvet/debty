import { apply, CreateExpenseOperation } from "./create-expense.operation";
import { GroupState } from "./state";

describe("CreateExpenseOperation", () => {
  const operation: CreateExpenseOperation = {
    eventDate: "2002-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
    operation: "CreateExpense",
    content: {
      id: "8ac0d320-feb4-438f-bc28-5390e0776679",
      name: "Housing",
      amount: 1300,
      date: "2000-01-01T00:00:00Z",
    },
  };

  it("should add a first expense", () => {
    const state: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
    };

    const expected: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      expenses: {
        "8ac0d320-feb4-438f-bc28-5390e0776679": {
          label: {
            timestamp: "2002-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "Housing",
          },
          amount: {
            timestamp: "2002-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: 1300,
          },
          date: {
            timestamp: "2002-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "2000-01-01T00:00:00Z",
          },
        },
      },
    };

    const actual = apply(state, operation);

    expect(actual).toEqual(expected);
  });

  it("should add an expense to the state", () => {
    const state: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      expenses: {
        "737be6ac-ed95-4065-bfb2-e69476b255f5": {
          label: {
            timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "Burger King",
          },
          amount: {
            timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: 200,
          },
          date: {
            timestamp: "2002-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "2000-01-01T00:00:00Z",
          },
        },
      },
    };

    const expected: GroupState = {
      id: "bcf58228-3f35-4b30-8276-6f1f3af61ff0",
      expenses: {
        "737be6ac-ed95-4065-bfb2-e69476b255f5": {
          label: {
            timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "Burger King",
          },
          amount: {
            timestamp: "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: 200,
          },
          date: {
            timestamp: "2002-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "2000-01-01T00:00:00Z",
          },
        },
        "8ac0d320-feb4-438f-bc28-5390e0776679": {
          label: {
            timestamp: "2002-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "Housing",
          },
          amount: {
            timestamp: "2002-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: 1300,
          },
          date: {
            timestamp: "2002-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417",
            value: "2000-01-01T00:00:00Z",
          },
        },
      },
    };

    const actual = apply(state, operation);

    expect(actual).toEqual(expected);
  });
});
