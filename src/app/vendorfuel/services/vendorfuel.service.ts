import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { VendorFuel } from "../models/vendorfuel.model";
import { ConfigService } from "../../core/config/config.service";

@Injectable({
  providedIn: 'root'
})
export class vendorfuelService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Fetches vendorfuel types with pagination and filters
  getVendorFuels(page: number, perPage: number, filters: any): Observable<VendorFuel[]> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<VendorFuel[]>(this.configService.vendorfuelUrl, { params });
  }

  // Fetches a single vendorfuel type by id
  getVendorFuelById(id: number): Observable<VendorFuel> {
    return this.http.get<VendorFuel>(`${this.configService.vendorfuelUrl}/${id}`);
  }

  // Creates a new vendorfuel type
  createVendorFuel(vendorfuel: VendorFuel): Observable<VendorFuel> {
    return this.http.post<VendorFuel>(this.configService.vendorfuelUrl, vendorfuel);
  }

  // Updates an existing vendorfuel type
  updateVendorFuel(id: number, vendorfuel: VendorFuel): Observable<VendorFuel> {
    return this.http.put<VendorFuel>(
      `${this.configService.vendorfuelUrl}/${id}`,
      vendorfuel
    );
  }

  // Deactivates a vendorfuel type
  deactivateVendorFuel(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.vendorfuelUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a package type
  deleteVendorFuel(id: number): Observable<any> {
    return this.http.delete(`${this.configService.vendorfuelUrl}/${id}`);
  }
}
