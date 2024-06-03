import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Lr } from "../models/lr.model";
import { ConfigService } from "../../core/config/config.service";

@Injectable({
  providedIn: 'root'
})
export class LrService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Fetches lr with pagination and filters
  getLrs(page: number, perPage: number, filters: any): Observable<Lr[]> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<Lr[]>(this.configService.lrUrl, { params });
  }

  // Fetches a single Lr by id
  getLrById(id: number): Observable<Lr> {
    return this.http.get<Lr>(`${this.configService.lrUrl}/${id}`);
  }

  // Creates a new Lr
  createLr(lr: Lr): Observable<Lr> {
    return this.http.post<Lr>(this.configService.lrUrl, lr);
  }
  getLrUrl(): string {
    return this.configService.lrUrl;
  }

  getLrUrl1(): string {
    return this.configService.lrdataUrl;
  }
  getLrUrl2(): string {
    return this.configService.fblrdataUrl;
  }
  // Updates an existing Lr
  updateLr(id: number, lr: Lr): Observable<Lr> {
    return this.http.put<Lr>(
      `${this.configService.lrUrl}/${id}`,
      lr
    );
  }

  // Deactivates a Lr
  deactivateLr(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.lrUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a Lr
  deleteLr(id: number): Observable<any> {
    return this.http.delete(`${this.configService.lrUrl}/${id}`);
  }

  getpaymodel(): Observable<any[]> {
    const endpoint = `${this.configService.lrUrl}/paymodel`; // Updated endpoint
 
    return this.http.get<any[]>(endpoint);
    }
    getpackagingmodel(): Observable<any[]> {
      const endpoint = `${this.configService.lrUrl}/packagetype/getdata`; // Updated endpoint
   
      return this.http.get<any[]>(endpoint);
      }
      getproductmodel(): Observable<any[]> {
        const endpoint = `${this.configService.lrUrl}/producttype/getpro`; // Updated endpoint
     
        return this.http.get<any[]>(endpoint);
        }
        searchCustomers(query: string, paytype: string): Observable<any[]> {
          return this.http.get<any[]>(`${this.configService.lrUrl}/data/${query}/${paytype}`);
        }
    searchfromCity(query: string): Observable<any[]> {
      const url = `${this.configService.lrUrl}/datacity/${query}`;
      return this.http.get<any[]>(url);
    }
    searchtocity(query: string): Observable<any[]> {
      const url = `${this.configService.lrUrl}/datatocity/${query}`;
      return this.http.get<any[]>(url);
    }
}
