import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GroupFormComponent } from "./group-form.component";
import { provideRouter } from "@angular/router";
import { GroupService, GroupServiceInMemory } from "../group.service";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("GroupFormComponent", () => {
  let component: GroupFormComponent;
  let fixture: ComponentFixture<GroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupFormComponent],
      providers: [provideRouter([]), provideAnimations(), { provide: GroupService, useClass: GroupServiceInMemory }],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
