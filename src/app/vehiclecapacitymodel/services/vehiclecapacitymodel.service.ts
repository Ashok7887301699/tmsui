import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ConfigService } from "../../core/config/config.service";
import { VehicleCapacityModel } from "../models/vehiclecapacitymodel.model";

@Injectable({
  providedIn: 'root'
})
export class VehiclecapacitymodelService {
  
  constructor(private http: HttpClient, private configService: ConfigService) { }

  // Fetches VehicleCapacityModel with pagination
  getVehicleCapacityModels(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.VehicleCapacityModelUrl, { params });
  }

  // Fetches a single VehicleCapacityModel by id
  getVehicleCapacityModelById(id: number): Observable<VehicleCapacityModel> {
    return this.http.get<VehicleCapacityModel>(`${this.configService.VehicleCapacityModelUrl}/${id}`);
  }

  // Creates a new VehicleCapacityModel
  createVehicleCapacityModel(vehiclecapacitymodel: VehicleCapacityModel): Observable<VehicleCapacityModel> {
    return this.http.post<VehicleCapacityModel>(this.configService.VehicleCapacityModelUrl, vehiclecapacitymodel);
  }

  // Updates an existing VehicleCapacityModel
  updateVehicleCapacityModel(id: number, vehiclecapacitymodel: VehicleCapacityModel): Observable<VehicleCapacityModel> {
    return this.http.put<VehicleCapacityModel>(
      `${this.configService.VehicleCapacityModelUrl}/${id}`,
      vehiclecapacitymodel
    );
  }

  // Deactivates a VehicleCapacityModel
  deactivateVehicleCapacityModel(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.VehicleCapacityModelUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a VehicleCapacityModel
  deleteVehicleCapacityModel(id: number): Observable<any> {
    return this.http.delete(`${this.configService.VehicleCapacityModelUrl}/${id}`);
  }
}
