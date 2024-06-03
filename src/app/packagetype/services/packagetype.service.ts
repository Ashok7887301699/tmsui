import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { PackageType } from "../models/packagetype.model";
import { ConfigService } from "../../core/config/config.service";

@Injectable({
  providedIn: 'root'
})
export class PackagetypeService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Fetches package types with pagination and filters
  getPackageTypes(page: number, perPage: number, filters: any): Observable<PackageType[]> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<PackageType[]>(this.configService.packagetypeUrl, { params });
  }

  // Fetches a single package type by id
  getPackageTypeById(id: number): Observable<PackageType> {
    return this.http.get<PackageType>(`${this.configService.packagetypeUrl}/${id}`);
  }

  // Creates a new package type
  createPackageType(packagetype: PackageType): Observable<PackageType> {
    return this.http.post<PackageType>(this.configService.packagetypeUrl, packagetype);
  }

  // Updates an existing package type
  updatePackageType(id: number, packagetype: PackageType): Observable<PackageType> {
    return this.http.put<PackageType>(
      `${this.configService.packagetypeUrl}/${id}`,
      packagetype
    );
  }

  // Deactivates a package type
  deactivatePackageType(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.packagetypeUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a package type
  deletePackageType(id: number): Observable<any> {
    return this.http.delete(`${this.configService.packagetypeUrl}/${id}`);
  }
}
