import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { merge, Observable, of, scan, shareReplay, startWith, Subject, switchMap, tap } from "rxjs";
import { map } from "rxjs/operators";
import { applyOperationToState, Operation } from "./operations";
import { GroupState } from "./operations/state";

export type Group = {
  id: string;
  name: string;
};

export abstract class GroupService {
  abstract createGroup(id: string): Observable<void>;

  abstract listGroups(): Observable<Group[]>;

  abstract getOperations(groupId: string): Observable<Operation[]>;
  abstract getAllOperations(): Observable<{ [id: string]: Operation[] }>;

  abstract saveOperation(groupId: string, operation: Operation): Observable<void>;

  getGlobalState(): Observable<{ [id: string]: GroupState }> {
    return this.getAllOperations().pipe(
      map((allOperations) => {
        const entries = Object.entries(allOperations);

        return Object.fromEntries(
          entries.map(([id, operations]) => {
            const originalState: GroupState = {
              id,
              expenses: {},
            };

            const finalState = operations.reduce((state, operation) => {
              return applyOperationToState(state, operation);
            }, originalState);

            return [id, finalState];
          }),
        );
      }),
    );
  }

  getState(id: string): Observable<GroupState> {
    return this.getOperations(id).pipe(
      map((operations) => {
        const originalState: GroupState = {
          id,
          expenses: {},
        };

        return operations.reduce((state, operation) => {
          return applyOperationToState(state, operation);
        }, originalState);
      }),
    );
  }
}

@Injectable()
export class GroupServiceHttp extends GroupService {
  constructor(private http: HttpClient) {
    super();
  }

  createGroup(id: string): Observable<void> {
    throw new Error("Not implemented");
  }

  listGroups(): Observable<Group[]> {
    return this.http.get<Group[]>("/groups");
  }

  getOperations(groupId: string): Observable<Operation[]> {
    throw new Error("Not implemented");
  }

  override saveOperation(groupId: string, operation: Operation): Observable<void> {
    throw new Error("Not implemented");
  }

  override getAllOperations(): Observable<{ [id: string]: Operation[] }> {
    throw new Error("Method not implemented.");
  }
}

type LocalState = { [id: string]: Operation[] };

@Injectable()
export class GroupServiceInMemory extends GroupService {
  override getAllOperations(): Observable<{ [id: string]: Operation[] }> {
    throw new Error("Method not implemented.");
  }

  groupCreation$ = new Subject<string>();
  operationAdd$ = new Subject<{ groupId: string; operation: Operation }>();

  state$ = merge(
    this.groupCreation$.pipe(
      map((groupId) => {
        return { kind: "GroupAdd" as const, groupId };
      }),
    ),
    this.operationAdd$.pipe(
      map(({ groupId, operation }) => {
        return { kind: "OperationAdd" as const, groupId, operation };
      }),
    ),
  ).pipe(
    scan((state: LocalState, value): LocalState => {
      if (value.kind === "GroupAdd") {
        return { ...state, [value.groupId]: [] };
      }

      if (value.kind === "OperationAdd") {
        const operations = state[value.groupId];
        return { ...state, [value.groupId]: [...operations, value.operation] };
      }

      value satisfies never;
      throw new Error("Not implemented");
    }, {}),
    startWith<LocalState>({}),
    tap((state) => {
      console.log({ state });
    }),
    shareReplay(1),
  );

  createGroup(_: string): Observable<void> {
    const id = crypto.randomUUID();
    this.groupCreation$.next(id);
    return of(undefined);
  }

  listGroups(): Observable<Group[]> {
    return this.state$.pipe(
      map((currentState) => {
        const groups = Object.keys(currentState);
        console.log(groups);
        return groups.map((id) => ({ id, name: id }));
      }),
    );
  }

  getOperations(groupId: string): Observable<Operation[]> {
    return this.state$.pipe(
      map((currentState) => {
        return currentState[groupId];
      }),
    );
  }

  saveOperation(groupId: string, operation: Operation): Observable<void> {
    this.operationAdd$.next({ groupId, operation });
    return of(undefined);
  }
}

const getLocalStorageState = (): LocalState => {
  const state = localStorage.getItem("state");
  if (state == null) {
    return {} as LocalState;
  }

  return JSON.parse(state) as LocalState;
};

@Injectable()
export class GroupServiceLocalStorage extends GroupService {
  groupCreation$ = new Subject<string>();
  operationAdd$ = new Subject<{ groupId: string; operation: Operation }>();

  state$ = of(getLocalStorageState()).pipe(
    switchMap((state) => {
      return merge(
        this.groupCreation$.pipe(
          map((groupId) => {
            return { kind: "GroupAdd" as const, groupId };
          }),
        ),
        this.operationAdd$.pipe(
          map(({ groupId, operation }) => {
            return { kind: "OperationAdd" as const, groupId, operation };
          }),
        ),
      ).pipe(
        scan((state: LocalState, value): LocalState => {
          if (value.kind === "GroupAdd") {
            return { ...state, [value.groupId]: [] };
          }

          if (value.kind === "OperationAdd") {
            const operations = state[value.groupId] ?? [];
            return { ...state, [value.groupId]: [...operations, value.operation] };
          }

          value satisfies never;
          throw new Error("Not implemented");
        }, state),
        startWith(state),
      );
    }),
    tap({
      next: (state) => {
        localStorage.setItem("state", JSON.stringify(state));
      },
      error: (error) => {
        console.error(error);
      },
    }),
    shareReplay(1),
  );

  createGroup(_: string): Observable<void> {
    const id = crypto.randomUUID();
    this.groupCreation$.next(id);
    return of(undefined);
  }

  override listGroups(): Observable<Group[]> {
    throw new Error("Not implemented");
  }

  // listGroups(): Observable<Group[]> {
  //   return this.state$.pipe(
  //     map((currentState) => {
  //       const entries = Object.entries(currentState);
  //       console.log(entries);
  //       return entries.map(([id, operations]) => ({ id, operations }));
  //     }),
  //   );
  // }

  getOperations(groupId: string): Observable<Operation[]> {
    return this.state$.pipe(
      map((currentState) => {
        return currentState[groupId];
      }),
    );
  }

  getAllOperations(): Observable<{ [id: string]: Operation[] }> {
    return this.state$;
  }

  saveOperation(groupId: string, operation: Operation): Observable<void> {
    this.operationAdd$.next({ groupId, operation });
    return of(undefined);
  }
}
