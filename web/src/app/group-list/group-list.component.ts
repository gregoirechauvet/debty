import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AsyncPipe } from "@angular/common";
import { GroupService } from "../group.service";
import { MatFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatList, MatListItem } from "@angular/material/list";
import { MatToolbar } from "@angular/material/toolbar";
import { map } from "rxjs/operators";

@Component({
  selector: "app-group-list",
  standalone: true,
  imports: [RouterLink, AsyncPipe, MatFabButton, MatIcon, MatList, MatListItem, MatToolbar],
  templateUrl: "./group-list.component.html",
  styleUrl: "./group-list.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupListComponent {
  readonly #router = inject(Router);
  readonly #groupService = inject(GroupService);

  readonly groups$ = this.#groupService.getGlobalState().pipe(
    map((state) => {
      return Object.values(state);
    }),
  );

  createGroup(): void {
    this.#router.navigate(["groups/new"]);
  }
}
