import { TestBed } from "@angular/core/testing";

import { ClockService } from "./clock.service";
import { DeviceService, DeviceServiceTest } from "../device/device.service";

describe("ClockService", () => {
  const deviceId = "f7b27354-aa9d-47be-8865-1b10e41fd589";
  let service: ClockService;

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date("2000-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DeviceService,
          useFactory: () => {
            return new DeviceServiceTest(deviceId);
          },
        },
      ],
    });
    service = TestBed.inject(ClockService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return increment counter as the time does not pass", () => {
    expect(service.now()).toBe(`2000-01-01T00:00:00.000Z-00001-${deviceId}`);
    expect(service.now()).toBe(`2000-01-01T00:00:00.000Z-00002-${deviceId}`);
  });

  it("should reset the counter as time passes", () => {
    expect(service.now()).toBe(`2000-01-01T00:00:00.000Z-00001-${deviceId}`);
    jasmine.clock().tick(50);
    expect(service.now()).toBe(`2000-01-01T00:00:00.050Z-00000-${deviceId}`);
  });

  it("should use remote clock as reference time", () => {
    const remoteClock = "2000-01-01T00:00:30.000Z-00002-65cf7c47-fbdb-4d77-a98c-ad748c50f44f";
    service.update(remoteClock);
    expect(service.now()).toBe(`2000-01-01T00:00:30.000Z-00004-${deviceId}`);
  });
});
