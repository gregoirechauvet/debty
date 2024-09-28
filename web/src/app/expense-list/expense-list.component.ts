import { ChangeDetectionStrategy, Component, inject, Pipe, PipeTransform } from "@angular/core";
import { MatFabButton } from "@angular/material/button";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupService } from "../group.service";
import { GroupState } from "../operations/state";
import { MatIcon } from "@angular/material/icon";
import { map } from "rxjs/operators";
import { MatList, MatListItem } from "@angular/material/list";
import { AsyncPipe, CurrencyPipe } from "@angular/common";
import { MatDivider } from "@angular/material/divider";

type Expense = {
  id: string;
  label: string;
  date: string;
  amount: number;
};

@Component({
  selector: "app-expense-list",
  standalone: true,
  imports: [MatFabButton, MatIcon, MatList, MatListItem, AsyncPipe, MatDivider, CurrencyPipe],
  templateUrl: "./expense-list.component.html",
  styleUrl: "./expense-list.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseListComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly groupService = inject(GroupService);

  // TODO: I would prefer to avoid to call .parent
  groupId = this.activatedRoute.snapshot.parent?.params["id"];
  expenses$ = this.groupService.getState(this.groupId).pipe(
    map((state) => {
      return computeExpensesFromState(state);
    }),
  );

  createExpense() {
    this.router.navigate(["expenses", "new"], { relativeTo: this.activatedRoute });
  }
}

function computeExpensesFromState(state: GroupState): Expense[] {
  const expenses = Object.entries(state.expenses ?? []);

  return expenses
    .map(([id, expense]): Expense => {
      const { date, amount, label } = expense;
      return { id, date: date.value, amount: amount.value, label: label.value };
    })
    .toSorted((a, b) => {
      return a.date.localeCompare(b.date);
    });
}
