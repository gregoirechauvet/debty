import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { MatFormField, MatHint, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { GroupService } from "../group.service";
import { CreateExpenseOperation } from "../operations/create-expense.operation";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";
import { MatCheckbox } from "@angular/material/checkbox";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";

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
    MatCheckbox,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: "./expense-form.component.html",
  styleUrl: "./expense-form.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseFormComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly groupService = inject(GroupService);
  private readonly formBuilder = inject(FormBuilder);

  readonly groupId = this.activatedRoute.snapshot.params["id"];
  readonly members = toSignal(
    this.groupService.getState(this.groupId).pipe(
      map((state) => {
        return Object.entries(state.members ?? {}).map(([id, value]) => {
          return { ...value, id };
        });
      }),
    ),
    { initialValue: [] },
  );

  readonly expenseForm = computed(() => {
    return new FormGroup({
      date: new FormControl(new Date(), { nonNullable: true, validators: [Validators.required] }),
      title: new FormControl<string>("", { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl<number | null>(null, { nonNullable: true, validators: [Validators.required] }),
      participants: this.formBuilder.nonNullable.group(
        Object.fromEntries(this.members().map((member) => [member.id, true])),
      ),
    });
  });

  onSubmit() {
    const form = this.expenseForm();
    console.log(form.value);

    if (!form.valid) {
      return;
    }

    const { title, amount, date } = form.value;
    if (title == null) {
      throw new Error("Nope");
    }
    if (amount == null) {
      throw new Error("Nope");
    }
    if (date == null) {
      throw new Error("Nope");
    }

    const operation: CreateExpenseOperation = {
      eventDate: "&é",
      operation: "CreateExpense",
      content: {
        id: crypto.randomUUID(),
        name: title,
        amount: Math.trunc(amount * 100),
        date: date.toISOString(),
      },
    };

    const groupId = this.activatedRoute.snapshot.params["id"];
    this.groupService.saveOperation(groupId, operation).subscribe(() => {
      this.router.navigate(["groups", groupId]);
    });
  }
}
