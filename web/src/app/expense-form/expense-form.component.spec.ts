import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ExpenseFormComponent } from "./expense-form.component";
import { provideRouter } from "@angular/router";
import { GroupService, GroupServiceInMemory } from "../group.service";

describe("ExpenseFormComponent", () => {
  let component: ExpenseFormComponent;
  let fixture: ComponentFixture<ExpenseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseFormComponent],
      providers: [provideRouter([]), { provide: GroupService, useClass: GroupServiceInMemory }],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
