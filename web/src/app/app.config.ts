import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideHttpClient } from "@angular/common/http";
import { GroupServiceInMemory, GroupService, GroupServiceLocalStorage } from "./group.service";
import { provideNativeDateAdapter } from "@angular/material/core";
import { provideServiceWorker } from "@angular/service-worker";

export const appConfig: ApplicationConfig = {
  providers: [
    // provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: GroupService, useClass: GroupServiceLocalStorage },
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000",
    }),
    provideExperimentalZonelessChangeDetection(),
  ],
};
