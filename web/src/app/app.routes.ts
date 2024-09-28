import { Routes } from "@angular/router";
import { GroupListComponent } from "./group-list/group-list.component";
import { GroupDetailComponent } from "./group-detail/group-detail.component";
import { ExpenseListComponent } from "./expense-list/expense-list.component";
import { GroupActivityComponent } from "./group-activity/group-activity.component";
import { ExpenseFormComponent } from "./expense-form/expense-form.component";
import { GroupFormComponent } from "./group-form/group-form.component";

export const routes: Routes = [
  { path: "", component: GroupListComponent },
  { path: "groups/new", component: GroupFormComponent },
  { path: "groups/:id/edit", component: GroupFormComponent },
  {
    path: "groups/:id",
    component: GroupDetailComponent,
    children: [
      { path: "", component: ExpenseListComponent },
      { path: "activity", component: GroupActivityComponent },
    ],
  },
  { path: "groups/:id/expenses/new", component: ExpenseFormComponent },
];
