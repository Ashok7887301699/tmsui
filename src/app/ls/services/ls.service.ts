import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ConfigService } from "../../core/config/config.service";
import { ls } from '../models/ls.model';
@Injectable({
  providedIn: 'root'
})
export class LsService {

  constructor(private http: HttpClient, private configService: ConfigService) {}

  getls(page: number, perPage: number, filters: any): Observable<ls[]> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<ls[]>(this.configService.lsUrl, { params });
  }

  // Fetches a single Drs by id
  getlsById(lsId: number): Observable<ls> {
    return this.http.get<ls>(`${this.configService.lsUrl}/${lsId}`);
  }

  // Creates a new Drs
  createls(ls: ls): Observable<ls> {
    return this.http.post<ls>(this.configService.lsUrl, ls);
  }
  // Updates an existing Drs
  updatels(lsId: number, ls: ls): Observable<ls> {
    return this.http.put<ls>(
      `${this.configService.lsUrl}/${lsId}`,
      ls
    );
  }

  // Deactivates a Drs
  deactivatels(lsId: number): Observable<any> {
    return this.http.patch(
      `${this.configService.lsUrl}/${lsId}/deactivate`,
      null
    );
  }

  // Deletes a Drs
  deletels(lsId: number): Observable<any> {
    return this.http.delete(`${this.configService.lsUrl}/${lsId}`);
  }

  getLrdata(query: string): Observable<any[]> {
    const endpoint = `${this.configService.lsUrl}/lrdata/${query}`;
    return this.http.get<any[]>(endpoint);
  }

  getLrDetails(lrId: string): Observable<any> {
    const endpoint = `${this.configService.lsUrl}/lrdetails/${lrId}`;
    return this.http.get<any>(endpoint);
  }

  
  getdepotname(): Observable<any[]> {
    const endpoint = `${this.configService.customerUrl}/fetchdeponame`; // Updated endpoint
 
    return this.http.get<any[]>(endpoint);
    }
}
