import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { CityMaster } from "../models/citymaster.model";
import { ConfigService } from "../../core/config/config.service";

@Injectable({
  providedIn: "root",
})
export class CityMasterService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getCityMasters(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.citymasterUrl, { params });
  }

  exportCityMasters(): Observable<any> {
    return this.http.get<any>(`${this.configService.citymasterUrl}/Alldata`);
  }

  // Fetches a single city master by id
  getCityMasterById(id: number): Observable<CityMaster> {
    return this.http.get<CityMaster>(
      `${this.configService.citymasterUrl}/${id}`
    );
  }

  // Creates a new city master
  createCityMaster(citymasters: CityMaster[]): Observable<CityMaster> {
    return this.http.post<CityMaster>(
      this.configService.citymasterUrl,
      { data: citymasters } // Wrap the array in an object with the key 'data'
    );
  }

  // sendDataToServer(requestData: { data: CityMaster[] }) {
  //   return this.http.post<any>(this.configService.citymasterUrl, requestData); // Changed to requestData
  // }

  // Updates an existing city master
  updateCityMaster(id: number, citymaster: CityMaster): Observable<CityMaster> {
    return this.http.put<CityMaster>(
      `${this.configService.citymasterUrl}/${id}`,
      citymaster
    );
  }

  // Deactivates a city master
  deactivateCityMaster(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.citymasterUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a city master
  deleteCityMaster(id: number): Observable<any> {
    return this.http.delete(`${this.configService.citymasterUrl}/${id}`);
  }

  getStates(): Observable<any[]> {
    const endpoint = `${this.configService.citymasterUrl}/states`; // Updated endpoint
    return this.http.get<any[]>(endpoint);
  }

  getDistricts(state: string): Observable<any[]> {
    const endpoint = `${this.configService.citymasterUrl}/districts`;
    const params = new HttpParams().set("state", state);

    return this.http.get<any[]>(endpoint, { params });
  }

  getTalukas(district: string): Observable<any[]> {
    const endpoint = `${this.configService.citymasterUrl}/talukas`; // Update the endpoint
    const params = new HttpParams().set("district", district); // Pass the selected district

    return this.http.get<any[]>(endpoint, { params });
  }

  getPostnames(taluka: string): Observable<any[]> {
    const endpoint = `${this.configService.citymasterUrl}/postnames`;
    const params = new HttpParams().set("taluka", taluka);

    return this.http.get<any[]>(endpoint, { params });
  }

  // In your CityMasterService:

  getPincodes(postname: string): Observable<any[]> {
    const endpoint = `${this.configService.citymasterUrl}/pincodes`;
    const params = new HttpParams().set("postname", postname);

    return this.http.get<any[]>(endpoint, { params });
  }
}
