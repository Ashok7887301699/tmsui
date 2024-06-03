import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Vendor } from "../models/vendor.model";
import { ConfigService } from "../../core/config/config.service";

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Fetches vendor with pagination and filters
  getVendors(page: number, perPage: number, filters: any): Observable<Vendor[]> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<Vendor[]>(this.configService.vendorUrl, { params });
  }

  // Fetches a single vendor by id
  getVendorById(id: number): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.configService.vendorUrl}/${id}`);
  }

  // Creates a new vendor
  createVendor(vendor: Vendor): Observable<Vendor> {
    return this.http.post<Vendor>(this.configService.vendorUrl, vendor);
  }

  // Updates an existing vendor
  updateVendor(id: number, vendor: Vendor): Observable<Vendor> {
    return this.http.put<Vendor>(
      `${this.configService.vendorUrl}/${id}`,
      vendor
    );
  }

  // Deactivates a vendor
  deactivateVendor(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.vendorUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a vendor
  deleteVendor(id: number): Observable<any> {
    return this.http.delete(`${this.configService.vendorUrl}/${id}`);
  }

  importExcel(vendors: Vendor[]): Observable<any> {
    return this.http.post<any>(`${this.configService.vendorUrl}/vendors/import-excel`, vendors);
  }
}
