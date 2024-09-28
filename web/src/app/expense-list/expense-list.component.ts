import { Component, OnInit, Pipe, PipeTransform } from "@angular/core";
import { MatFabButton } from "@angular/material/button";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupService } from "../group.service";
import { GroupState } from "../operations/state";
import { MatIcon } from "@angular/material/icon";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MatList, MatListItem } from "@angular/material/list";
import { AsyncPipe, CurrencyPipe } from "@angular/common";
import { MatDivider } from "@angular/material/divider";

@Pipe({ name: "debug", pure: true, standalone: true })
class DebugPipe implements PipeTransform {
  transform(value: any): string {
    return JSON.stringify(value, undefined, 2);
  }
}

type Expense = {
  id: string;
  label: string;
  date: string;
  amount: number;
};

@Component({
  selector: "app-expense-list",
  standalone: true,
  imports: [MatFabButton, MatIcon, DebugPipe, MatList, MatListItem, AsyncPipe, MatDivider, CurrencyPipe],
  templateUrl: "./expense-list.component.html",
  styleUrl: "./expense-list.component.css",
})
export class ExpenseListComponent implements OnInit {
  expenses$!: Observable<Expense[]>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
  ) {}

  ngOnInit() {
    // TODO: I would prefer to avoid to call .parent
    const groupId = this.activatedRoute.snapshot.parent?.params["id"];

    this.expenses$ = this.groupService.getState(groupId).pipe(
      map((state) => {
        return computeExpensesFromState(state);
      }),
    );
  }

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
