import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { PickupRequestNote } from "../models/pickuprequestnote.model";
import { ConfigService } from "../../core/config/config.service";

@Injectable({
  providedIn: "root",
})
export class PickuprequestnoteService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Fetches pickuprequestnotes with pagination
  getPRNs(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.pickuprequestnoteUrl, {
      params,
    });
  }

  // Fetches a single pickuprequestnote by id
  getPRNById(id: number): Observable<PickupRequestNote> {
    return this.http.get<PickupRequestNote>(
      `${this.configService.pickuprequestnoteUrl}/${id}`
    );
  }

  getHvendor(): Observable<any[]> {
    const pickuprequestnote = `${this.configService.pickuprequestnoteUrl}/Hname`; // Updated endpoint

    return this.http.get<any[]>(pickuprequestnote);
  }

  // Creates a new pickuprequestnote
  createPRN(
    pickuprequestnote: PickupRequestNote
  ): Observable<PickupRequestNote> {
    return this.http.post<PickupRequestNote>(
      this.configService.pickuprequestnoteUrl,
      pickuprequestnote
    );
  }

  // Updates an existing pickuprequestnote
  updatePRN(
    id: number,
    pickuprequestnote: PickupRequestNote
  ): Observable<PickupRequestNote> {
    return this.http.put<PickupRequestNote>(
      `${this.configService.pickuprequestnoteUrl}/${id}`,
      pickuprequestnote
    );
  }

  // Deletes a pickuprequestnote
  deletePRN(id: number): Observable<any> {
    return this.http.delete(`${this.configService.pickuprequestnoteUrl}/${id}`);
  }

  searchCustomers(query: string): Observable<any[]> {
    const url = `${this.configService.pickuprequestnoteUrl}/data/${query}`;
    return this.http.get<any[]>(url);
  }

  fetchLRNumbers(
    fromDate: string,
    toDate: string,
    customerName: string
  ): Observable<any[]> {
    const url = `${this.configService.pickuprequestnoteUrl}/lrNumbers`;
    const params = {
      fromDate: fromDate,
      toDate: toDate,
      customerName: customerName,
    };
    return this.http.get<any[]>(url, { params: params });
  }

  searchVehicles(query: string): Observable<any[]> {
    const url = `${this.configService.pickuprequestnoteUrl}/vehicledata/${query}`;
    return this.http.get<any[]>(url);
  }

  searchByDate(fromDate: Date, toDate: Date): Observable<any> {
    const url = `${this.configService.pickuprequestnoteUrl}/bydate`;
    // Pass fromDate and toDate as query parameters
    const params = {
      fromDate: fromDate.toISOString(), // Convert dates to ISO string format
      toDate: toDate.toISOString(),
    };
    return this.http.get<any[]>(url, { params });
  }

  searchByPRN(id: string): Observable<any> {
    const url = `${this.configService.pickuprequestnoteUrl}/byprn/${id}`; // Assuming the API endpoint is /byprn/:id
    return this.http.get<any[]>(url);
  }

  FetchByPRN(id: string): Observable<any> {
    const url = `${this.configService.pickuprequestnoteUrl}/prnarrival/${id}`; // Assuming the API endpoint is /byprn/:id
    return this.http.get<any>(url);
  }
}
