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
  let service: DeviceServiceTest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceServiceTest],
    });
    service = TestBed.inject(DeviceServiceTest);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
