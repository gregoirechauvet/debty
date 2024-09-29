import { Injectable } from "@angular/core";
import { HybridLogicalClock } from "./hybrid-logical-clock";
import { DeviceService } from "../device/device.service";

@Injectable({
  providedIn: "root",
})
export class ClockService {
  #clock: HybridLogicalClock;

  constructor(deviceService: DeviceService) {
    const systemTime = Date.now();
    const counter = 0;
    const deviceId = deviceService.deviceId;
    this.#clock = new HybridLogicalClock(systemTime, counter, deviceId);
  }

  now(): string {
    const systemTime = Date.now();
    this.#clock = this.#clock.send(systemTime);
    return this.#clock.valueOf();
  }

  update(remoteTime: string) {
    const systemTime = Date.now();
    const remoteClock = HybridLogicalClock.parse(remoteTime);
    this.#clock = this.#clock.receive(remoteClock, systemTime);
  }
}
