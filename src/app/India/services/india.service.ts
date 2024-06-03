// src/app/india/services/india.service.ts

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { India } from "../models/india.model";
import { ConfigService } from "../../core/config/config.service";

@Injectable({
  providedIn: "root",
})
export class IndiaService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Fetches indias with pagination
  getIndias(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.indiaUrl, { params });
  }

  // Fetches a single india by id
  getIndiaById(id: number): Observable<India> {
    return this.http.get<India>(`${this.configService.indiaUrl}/${id}`);
  }

  // Creates a new india
  createIndia(india: India): Observable<India> {
    return this.http.post<India>(this.configService.indiaUrl, india);
  }

  // Updates an existing india
  updateIndia(id: number, india: India): Observable<India> {
    return this.http.put<India>(
      `${this.configService.indiaUrl}/${id}`,
      india
    );
  }

  // Deactivates a india
  deactivateIndia(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.indiaUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a india
  deleteIndia(id: number): Observable<any> {
    return this.http.delete(`${this.configService.indiaUrl}/${id}`);
  }
}
