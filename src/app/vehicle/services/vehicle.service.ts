import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ConfigService } from "../../core/config/config.service";
import { Vehicle } from '../models/vehicle.model';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getVehicle(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.vehicleUrl, { params });
  }

  getVehicleById(SrNo: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.configService.vehicleUrl}/${SrNo}`);
  }

  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.configService.vehicleUrl, vehicle);
  }

  getvehcpctmodel(): Observable<any[]> {
    const endpoint = `${this.configService.vehicleUrl}/vehcpctmodel`; // Updated endpoint
 
    return this.http.get<any[]>(endpoint);
    }

    getVehiclecpct(): Observable<any[]> {
      const endpoint = `${this.configService.vehicleUrl}/vehiclecpct`;
      return this.http.get<any[]>(endpoint);
    }

  updateVehicle(SrNo: number, vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(
      `${this.configService.vehicleUrl}/${SrNo}`,
      vehicle
    );
  }

  deactivateVehicle(SrNo: number): Observable<any> {
    return this.http.patch(
      `${this.configService.vehicleUrl}/${SrNo}/deactivate`,
      null
    );
  }

  deleteVehicle(SrNo: number): Observable<any> {
    return this.http.delete(`${this.configService.vehicleUrl}/${SrNo}`);
  }
}
