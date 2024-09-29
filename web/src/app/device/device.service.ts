export abstract class DeviceService {
  abstract get deviceId(): string;
}

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

export class DeviceServiceTest extends DeviceService {
  readonly #deviceId: string;

  constructor(deviceId: string) {
    super();
    this.#deviceId = deviceId;
  }

  get deviceId(): string {
    return this.#deviceId;
  }
}
