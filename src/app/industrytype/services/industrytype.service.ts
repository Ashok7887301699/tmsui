import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ConfigService } from "../../core/config/config.service";
import { IndustryType } from "../models/industrytype.model";

@Injectable({
  providedIn: 'root'
})
export class IndustrytypeService {
  
  constructor(private http: HttpClient, private configService: ConfigService) { }

  // Fetches Industrytype with pagination
  getIndustrytypes(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.IndustrytypeUrl, { params });
  }

  // Fetches a single Industrytype by id
  getIndustrytypeById(id: number): Observable<IndustryType> {
    return this.http.get<IndustryType>(`${this.configService.IndustrytypeUrl}/${id}`);
  }

  // Creates a new Industrytype
  createIndustrytype(industrytype: IndustryType): Observable<IndustryType> {
    return this.http.post<IndustryType>(this.configService.IndustrytypeUrl, industrytype);
  }

  // Updates an existing Industrytype
  updateIndustrytype(id: number, industrytype: IndustryType): Observable<IndustryType> {
    return this.http.put<IndustryType>(
      `${this.configService.IndustrytypeUrl}/${id}`,
      industrytype
    );
  }

  // Deactivates a industrytype
  deactivateIndustrytype(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.IndustrytypeUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a Industrytype
  deleteIndustrytype(id: number): Observable<any> {
    return this.http.delete(`${this.configService.IndustrytypeUrl}/${id}`);
  }
}
