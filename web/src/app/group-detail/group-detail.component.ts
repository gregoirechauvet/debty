import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatTab, MatTabGroup, MatTabLink, MatTabNav, MatTabNavPanel } from "@angular/material/tabs";
import { GroupService } from "../group.service";
import { switchMap } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";

@Component({
  selector: "app-group-detail",
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatToolbar,
    RouterLink,
    RouterOutlet,
    MatTabGroup,
    MatTab,
    MatTabNav,
    MatTabLink,
    MatTabNavPanel,
    RouterLinkActive,
    AsyncPipe,
    MatMenuItem,
    MatMenu,
    MatMenuTrigger,
  ],
  templateUrl: "./group-detail.component.html",
  styleUrl: "./group-detail.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupDetailComponent {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #groupService = inject(GroupService);

  readonly groupId$ = this.#activatedRoute.paramMap.pipe(
    map((paramMap) => {
      const groupId = paramMap.get("id");
      if (groupId === null) {
        throw new Error("Missing group id from URL");
      }
      return groupId;
    }),
  );
  readonly state$ = this.groupId$.pipe(
    switchMap((groupId) => {
      return this.#groupService.getState(groupId);
    }),
  );

  groupId = toSignal(this.groupId$);
}
