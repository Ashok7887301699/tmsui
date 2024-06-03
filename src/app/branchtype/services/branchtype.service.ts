import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ConfigService } from "../../core/config/config.service";
import { BranchType } from "../models/branchtype.model";

@Injectable({
  providedIn: 'root'
})
export class BranchtypeService {
  
  constructor(private http: HttpClient, private configService: ConfigService) { }

  // Fetches BranchType with pagination
  getBranchtypes(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.BranchtypeUrl, { params });
  }

  // Fetches a single BranchType by id
  getBranchtypeById(id: number): Observable<BranchType> {
    return this.http.get<BranchType>(`${this.configService.BranchtypeUrl}/${id}`);
  }

  // Creates a new BranchType
  createBranchtype(formData: any): Observable<BranchType> {
    return this.http.post<BranchType>(this.configService.BranchtypeUrl, formData);
  }

  // Updates an existing BranchType
  updateBranchtype(id: number, branchtype: BranchType): Observable<BranchType> {
    return this.http.put<BranchType>(
      `${this.configService.BranchtypeUrl}/${id}`,
      branchtype
    );
  }

  // Deactivates a BranchType
  deactivateBranchtype(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.BranchtypeUrl}/${id}/deactivate`,
      {} // Send an empty object as the request body
    );
  }
  

  // Deletes a BranchType
  deleteBranchtype(id: number): Observable<any> {
    return this.http.delete(`${this.configService.BranchtypeUrl}/${id}`);
  }
}
