import { Component, OnInit } from "@angular/core";
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";
import { MatButton, MatIconButton } from "@angular/material/button";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormField, MatInput } from "@angular/material/input";
import { MatLabel } from "@angular/material/form-field";
import { GroupService } from "../group.service";
import { SetGroupNameOperation } from "../operations/set-group-name.operation";

@Component({
  selector: "app-group-form",
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatLabel,
    MatIconButton,
    RouterLink,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatButton,
  ],
  templateUrl: "./group-form.component.html",
  styleUrl: "./group-form.component.css",
})
export class GroupFormComponent implements OnInit {
  groupId!: string | null;

  groupForm = new FormGroup({
    name: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
  ) {}

  async ngOnInit() {
    this.groupId = this.activatedRoute.snapshot.params["id"];
    if (!this.groupId) {
      return;
    }

    // TODO: unsubscribe
    this.groupService.getState(this.groupId).subscribe((state) => {
      console.log(state);
      if (state.name?.value !== undefined) {
        this.groupForm.setValue({ name: state.name.value });
      }
    });
  }

  onSubmit() {
    if (!this.groupForm.valid) {
      return;
    }

    const { name } = this.groupForm.value;
    if (name == null) {
      throw new Error("Nope");
    }

    if (this.groupId) {
      this.editGroup(this.groupId, name);
    } else {
      this.createGroup(name);
    }
  }

  createGroup(name: string) {
    const id = crypto.randomUUID();
    this.editGroup(id, name);
  }

  editGroup(groupId: string, name: string) {
    const operation: SetGroupNameOperation = {
      eventDate: new Date().toISOString(),
      operation: "SetGroupName",
      content: {
        name,
      },
    };

    this.groupService.saveOperation(groupId, operation).subscribe(() => {
      this.router.navigate(["groups", groupId]);
    });
  }
}
