import { provideRouter } from "@angular/router";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GroupDetailComponent } from "./group-detail.component";
import { GroupServiceInMemory, GroupService } from "../group.service";

describe("GroupDetailComponent", () => {
  let component: GroupDetailComponent;
  let fixture: ComponentFixture<GroupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDetailComponent],
      providers: [provideRouter([]), { provide: GroupService, useClass: GroupServiceInMemory }],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
