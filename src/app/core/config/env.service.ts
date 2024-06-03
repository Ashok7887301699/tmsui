import { Injectable } from "@angular/core";

export interface Apps {
  [key: string]: string;
}

@Injectable({
  providedIn: "root",
})
export class EnvService {
  // Environment URLs
  // appBaseUrl is for this angular app. It's not yet used anywhere.
  public appBaseUrl = "http://localhost:4200";

  // apiBaseUrl is for RESTful api backend
  public apiBaseUrl = "http://localhost:8000";

  // Apps
  public apps = {
    "TMS Vendor App": "http://localhost/vendor",
    "TMS Customer Care App": "http://localhost/cc",
  };

  constructor() {}
}
