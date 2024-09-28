import { provideRouter } from "@angular/router";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GroupListComponent } from "./group-list.component";
import { GroupServiceInMemory, GroupService } from "../group.service";

describe("GroupListComponent", () => {
  let component: GroupListComponent;
  let fixture: ComponentFixture<GroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupListComponent],
      providers: [provideRouter([]), { provide: GroupService, useClass: GroupServiceInMemory }],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
