import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ExpenseListComponent } from "./expense-list.component";
import { provideRouter } from "@angular/router";
import { GroupService, GroupServiceInMemory } from "../group.service";

describe("ExpenseListComponent", () => {
  let component: ExpenseListComponent;
  let fixture: ComponentFixture<ExpenseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseListComponent],
      providers: [provideRouter([]), { provide: GroupService, useClass: GroupServiceInMemory }],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
