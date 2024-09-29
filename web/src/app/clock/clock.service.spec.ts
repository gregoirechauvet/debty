import { TestBed } from "@angular/core/testing";

import { ClockService } from "./clock.service";
import { DeviceService, DeviceServiceTest } from "../device/device.service";

describe("ClockService", () => {
  let service: ClockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DeviceService,
          useClass: DeviceServiceTest,
        },
      ],
    });
    service = TestBed.inject(ClockService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
