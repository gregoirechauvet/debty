import { Component, OnInit } from "@angular/core";
import { MatFormField, MatHint, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { GroupService } from "../group.service";
import { CreateExpenseOperation } from "../operations/create-expense.operation";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-expense-form",
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatHint,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    ReactiveFormsModule,
    MatButton,
    MatIconButton,
    MatToolbar,
    MatIcon,
    RouterLink,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: "./expense-form.component.html",
  styleUrl: "./expense-form.component.css",
})
export class ExpenseFormComponent implements OnInit {
  expenseForm = new FormGroup({
    date: new FormControl(new Date(), { nonNullable: true, validators: [Validators.required] }),
    title: new FormControl<string>("", { nonNullable: true, validators: [Validators.required] }),
    amount: new FormControl<number | null>(null, { nonNullable: true, validators: [Validators.required] }),
  });
  groupId!: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
  ) {}

  ngOnInit() {
    this.groupId = this.activatedRoute.snapshot.params["id"];
  }

  onSubmit() {
    if (!this.expenseForm.valid) {
      return;
    }

    const { title, amount, date } = this.expenseForm.value;
    if (title == null) {
      throw new Error("Nope");
    }
    if (amount == null) {
      throw new Error("Nope");
    }
    if (date == null) {
      throw new Error("Nope");
    }

    const pouf = this.expenseForm.get("title");

    const operation: CreateExpenseOperation = {
      eventDate: "&é",
      operation: "CreateExpense",
      content: {
        id: window.crypto.randomUUID(),
        name: title,
        amount: Math.trunc(amount * 100),
        date: date.toISOString(),
      },
    };

    const groupId = this.activatedRoute.snapshot.params["id"];
    console.log(this.activatedRoute.snapshot.params);

    this.groupService.saveOperation(groupId, operation).subscribe(() => {
      this.router.navigate(["groups", groupId]);
    });
  }
}
