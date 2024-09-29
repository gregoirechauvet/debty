import { provideRouter, Router } from "@angular/router";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GroupDetailComponent } from "./group-detail.component";
import { GroupServiceInMemory, GroupService } from "../group.service";
import { MockPlatformLocation, provideLocationMocks } from "@angular/common/testing";
import { PlatformLocation } from "@angular/common";

describe("GroupDetailComponent", () => {
  let component: GroupDetailComponent;
  let fixture: ComponentFixture<GroupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDetailComponent],
      providers: [
        provideRouter([
          {
            path: "test/:id",
            component: GroupDetailComponent,
          },
        ]),
        // provideLocationMocks(),
        { provide: PlatformLocation, useClass: MockPlatformLocation },
        { provide: GroupService, useClass: GroupServiceInMemory },
      ],
    }).compileComponents();

    // const router = TestBed.inject(Router);
    // router.navigate(["test", "123"]);
    const location = TestBed.inject(PlatformLocation);
    location.pushState(null, "Test Page", "/test/123");

    fixture = TestBed.createComponent(GroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
