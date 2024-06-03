// src/app/Driver/services/Driver.service.ts

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Driver } from "../models/driver.model";
import { ConfigService } from "../../core/config/config.service";

@Injectable({
  providedIn: "root",
})
export class DriverService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Fetches Drivers with pagination
  getDrivers(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.driverMasterUrl, { params });
  }

  // Fetches a single Driver by id
  getDriverById(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.configService.driverMasterUrl}/${id}`);
  }

  // Creates a new Driver
  createDriver(formData: FormData): Observable<Driver> {
    return this.http.post<Driver>(this.configService.driverMasterUrl, formData);
  }

  // Updates an existing driver
  updateDriver(id: number, formData: FormData): Observable<Driver> {
    return this.http.put<Driver>(
      `${this.configService.driverMasterUrl}/${id}`,
      formData
    );
  }

  // Deactivates a Driver
  deactivateDriver(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.driverMasterUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a Driver
  deleteDriver(id: number): Observable<any> {
    return this.http.delete(`${this.configService.driverMasterUrl}/${id}`);
  }
}
