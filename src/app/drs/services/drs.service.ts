import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable,throwError } from "rxjs";
import { Drs } from "../models/drs.model";
import { ConfigService } from "../../core/config/config.service";
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DrsService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Fetches Drs with pagination and filters
  getDrss(page: number, perPage: number, filters: any): Observable<Drs[]> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<Drs[]>(this.configService.drsUrl, { params });
  }

  // Fetches a single Drs by id
  getDrsById(id: number): Observable<Drs> {
    return this.http.get<Drs>(`${this.configService.drsUrl}/${id}`);
  }

  // Creates a new Drs
  createDrs(drs: Drs): Observable<Drs> {
    return this.http.post<Drs>(`${this.configService.drsUrl}/savedrs`, drs);
  }

  getVendorName(): Observable<any[]> {
    const endpoint = `${this.configService.drsUrl}/vendors/attached`; // Updated endpoint
    return this.http.get<any[]>(endpoint);
    }
    getOwnVendorNames(): Observable<any[]> {
      const endpoint = `${this.configService.drsUrl}/vendornames`;
      return this.http.get<any[]>(endpoint);
    }

    getVehicleNumbers(vendorName: string): Observable<any[]> {
      const endpoint = `${this.configService.drsUrl}/vehiclenumbers/${vendorName}`;
      return this.http.get<any[]>(endpoint);
  }
  getDriverNames(): Observable<any[]> {
    const endpoint = `${this.configService.drsUrl}/data/drivernames`;
    return this.http.get<any[]>(endpoint);
  }

  gethamaliname():Observable<any[]> {
    const endpoint = `${this.configService.drsUrl}/hamali`;
    return this.http.get<any[]>(endpoint);
  }

  getFuelNames():Observable<any[]> {
    const endpoint = `${this.configService.drsUrl}/fuel`;
    return this.http.get<any[]>(endpoint);
  }

  getVehicleCapacity(): Observable<any[]> {
    const endpoint = `${this.configService.drsUrl}/datacm/capacity`;
    return this.http.get<any[]>(endpoint);
  }

  getLsdata(query: string): Observable<any[]> {
    const endpoint = `${this.configService.drsUrl}/lsdata/${query}`;
    return this.http.get<any[]>(endpoint);
  }


  getLsDetails(lsId: string): Observable<any> {
    const endpoint = `${this.configService.drsUrl}/custom-ls/${lsId}`;
    return this.http.get<any>(endpoint);
  }



  sendOtp(mobileNo: string): Observable<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP as string
    const apiUrl = `http://mobicomm.dove-sms.com//submitsms.jsp?user=Harsal&key=97e1eb345dXX&mobile=${mobileNo}&message=Your%20OTP%20for%20mobile%20verification%20is%20${otp}.VTC3PL%20SERVICES%20PVT%20LTD&senderid=VTCSMS&accusage=1&entityid=1701158047394329108&tempid=1707165909710698116`;
  
    return this.http.get(apiUrl, { responseType: 'text' }).pipe(
      map(response => otp), // Return the generated OTP
      catchError(error => throwError(error))
    );
  }
  
  
  

  // Updates an existing Drs
  updateDrs(id: number, drs: Drs): Observable<Drs> {
    return this.http.put<Drs>(
      `${this.configService.drsUrl}/${id}`,
      drs
    );
  }

  // Deactivates a Drs
  deactivateDrs(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.drsUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a Drs
  deleteDrs(id: number): Observable<any> {
    return this.http.delete(`${this.configService.drsUrl}/${id}`);
  }
}
