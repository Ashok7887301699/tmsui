// src/app/tenant/services/tenant.service.ts

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Tenant } from "../models/tenant.model";
import { ConfigService } from "../../core/config/config.service";

@Injectable({
  providedIn: "root",
})
export class TenantService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Fetches tenants with pagination
  getTenants(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.tenantUrl, { params });
  }

  // Fetches a single tenant by id
  getTenantById(id: number): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.configService.tenantUrl}/${id}`);
  }

  // Creates a new tenant
  createTenant(tenant: Tenant): Observable<Tenant> {
    return this.http.post<Tenant>(this.configService.tenantUrl, tenant);
  }

  // Updates an existing tenant
  updateTenant(id: number, tenant: Tenant): Observable<Tenant> {
    return this.http.put<Tenant>(
      `${this.configService.tenantUrl}/${id}`,
      tenant
    );
  }

  // Deactivates a tenant
  deactivateTenant(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.tenantUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a tenant
  deleteTenant(id: number): Observable<any> {
    return this.http.delete(`${this.configService.tenantUrl}/${id}`);
  }
}
