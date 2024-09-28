import { Component, OnInit } from "@angular/core";
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatTab, MatTabGroup, MatTabLink, MatTabNav, MatTabNavPanel } from "@angular/material/tabs";
import { GroupService } from "../group.service";
import { Observable } from "rxjs";
import { GroupState } from "../operations/state";
import { AsyncPipe } from "@angular/common";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";

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
})
export class GroupDetailComponent implements OnInit {
  groupId!: string;
  state$!: Observable<GroupState>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
  ) {}

  ngOnInit() {
    // TODO: unsubscribe
    this.activatedRoute.params.subscribe((params) => {
      this.groupId = params["id"];
      this.state$ = this.groupService.getState(this.groupId);
    });
  }
}
