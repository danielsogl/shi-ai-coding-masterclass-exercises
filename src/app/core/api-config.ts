import { InjectionToken } from "@angular/core";

export interface ApiConfig {
  readonly tasksUrl: string;
}

export const API_CONFIG = new InjectionToken<ApiConfig>("API_CONFIG", {
  providedIn: "root",
  factory: () => ({ tasksUrl: "/api/tasks" }),
});
