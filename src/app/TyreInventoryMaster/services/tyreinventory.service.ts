import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Tyreinventory } from '../models/tyreinventory.model';
import { ConfigService } from "../../core/config/config.service";
@Injectable({
  providedIn: 'root'
})
export class TyreinventoryService {

 

  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Fetches tyreinventorys with pagination
  gettyreinventory(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.tyreInventoryUrl, { params });
  }

  // Fetches a single tyreinventory by id
  gettyreinventoryById(id: number): Observable<Tyreinventory> {
    return this.http.get<Tyreinventory>(`${this.configService.tyreInventoryUrl}/${id}`);
  }

  // Creates a new tyreinventory
  createtyreinventory(tyreinventory: Tyreinventory): Observable<Tyreinventory> {
    return this.http.post<Tyreinventory>(this.configService.tyreInventoryUrl, tyreinventory);
  }

  // Updates an existing tyreinventory
  updatetyreinventory(id: number, tyreinventory: Tyreinventory): Observable<Tyreinventory> {
    return this.http.put<Tyreinventory>(
      `${this.configService.tyreInventoryUrl}/${id}`,
      tyreinventory
    );
  }

  // Deactivates a tyreinventory
  deactivatetyreinventory(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.tyreInventoryUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a tyreinventory
  deletetyreinventory(id: number): Observable<any> {
    return this.http.delete(`${this.configService.tyreInventoryUrl}/${id}`);
  }
}
