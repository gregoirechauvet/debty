import { Injectable } from "@angular/core";

export abstract class DeviceService {
  abstract get deviceId(): string;
}

@Injectable()
export class DeviceServiceLocalStorage extends DeviceService {
  readonly #deviceId: string;

  constructor() {
    super();

    const deviceId = localStorage.getItem("deviceId");
    if (deviceId !== null) {
      this.#deviceId = deviceId;
    }

    const generatedDeviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", generatedDeviceId);
    this.#deviceId = generatedDeviceId;
  }

  get deviceId(): string {
    return this.#deviceId;
  }
}

@Injectable()
export class DeviceServiceTest extends DeviceService {
  get deviceId(): string {
    return "6a5fd8e9-6500-47af-bed2-b23c19d05c3b";
  }
}
