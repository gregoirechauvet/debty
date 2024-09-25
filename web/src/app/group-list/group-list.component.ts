import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css'
})
export class GroupListComponent {
  groups = [
    { id: "123", name: "Les oiseaux" },
  ]
}
