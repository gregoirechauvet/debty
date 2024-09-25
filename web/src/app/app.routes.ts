import { Routes } from '@angular/router';
import {GroupListComponent} from "./group-list/group-list.component";
import {GroupDetailComponent} from "./group-detail/group-detail.component";

export const routes: Routes = [
  { path: "", component: GroupListComponent },
  { path: "groups/:id", component: GroupDetailComponent },
];
