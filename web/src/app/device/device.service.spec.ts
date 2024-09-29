import { TestBed } from "@angular/core/testing";

import { DeviceServiceLocalStorage, DeviceServiceTest } from "./device.service";

describe("DeviceServiceLocalStorage", () => {
  let service: DeviceServiceLocalStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceServiceLocalStorage],
    });
    service = TestBed.inject(DeviceServiceLocalStorage);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

describe("DeviceServiceTest", () => {
  const deviceId = "f7b27354-aa9d-47be-8865-1b10e41fd589";
  let service: DeviceServiceTest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DeviceServiceTest,
          useFactory: () => {
            return new DeviceServiceTest(deviceId);
          },
        },
      ],
    });
    service = TestBed.inject(DeviceServiceTest);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return the deviceId provided", () => {
    expect(service.deviceId).toBe(deviceId);
  });
});
