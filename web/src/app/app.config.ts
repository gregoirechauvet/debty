import { ApplicationConfig, isDevMode, provideExperimentalZonelessChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideHttpClient } from "@angular/common/http";
import { provideServiceWorker } from "@angular/service-worker";
import { GroupService, GroupServiceLocalStorage } from "./group.service";
import { DeviceService, DeviceServiceLocalStorage } from "./device/device.service";

export const appConfig: ApplicationConfig = {
  providers: [
    // provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000",
    }),
    provideExperimentalZonelessChangeDetection(),
    { provide: GroupService, useClass: GroupServiceLocalStorage },
    { provide: DeviceService, useClass: DeviceServiceLocalStorage },
  ],
};
