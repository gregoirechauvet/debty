import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AsyncPipe } from "@angular/common";
import { Group, GroupService } from "../group.service";
import { MatFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatList, MatListItem } from "@angular/material/list";
import { MatToolbar } from "@angular/material/toolbar";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GroupState } from "../operations/state";

@Component({
  selector: "app-group-list",
  standalone: true,
  imports: [RouterLink, AsyncPipe, MatFabButton, MatIcon, MatList, MatListItem, MatToolbar],
  templateUrl: "./group-list.component.html",
  styleUrl: "./group-list.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupListComponent implements OnInit {
  // state$!: Observable<GroupState[]>;
  groups$!: Observable<GroupState[]>;

  constructor(
    private router: Router,
    private groupService: GroupService,
  ) {}

  ngOnInit(): void {
    this.groups$ = this.groupService.getGlobalState().pipe(
      map((state) => {
        const entries = Object.entries(state);
        return entries.map(([id, state]) => state);
      }),
    );
  }

  createGroup(): void {
    this.router.navigate(["groups/new"]);
    // this.groupService.createGroup("1234").subscribe(() => {});
  }
}
