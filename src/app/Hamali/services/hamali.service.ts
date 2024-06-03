import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Hamali } from "../models/hamali.model";
import { ConfigService } from "../../core/config/config.service";

@Injectable({
  providedIn: 'root'
})
export class HamaliService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Fetches Hamali with pagination and filters
  getHamalis(page: number, perPage: number, filters: any): Observable<Hamali[]> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<Hamali[]>(this.configService.hamaliUrl, { params });
  }

  // Fetches a single Hamali by id
  getHamaliById(id: number): Observable<Hamali> {
    return this.http.get<Hamali>(`${this.configService.hamaliUrl}/${id}`);
  }

  // Creates a new Hamali
  createHamali(hamali: Hamali): Observable<Hamali> {
    return this.http.post<Hamali>(this.configService.hamaliUrl, hamali);
  }

  // Updates an existing Hamali
  updateHamali(id: number, hamali: Hamali): Observable<Hamali> {
    return this.http.put<Hamali>(
      `${this.configService.hamaliUrl}/${id}`,
      hamali
    );
  }

  // Deactivates a Hamali
  deactivateHamali(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.hamaliUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a Hamali
  deleteHamali(id: number): Observable<any> {
    return this.http.delete(`${this.configService.hamaliUrl}/${id}`);
  }
}
