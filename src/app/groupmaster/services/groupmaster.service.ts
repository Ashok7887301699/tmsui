import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ConfigService } from "../../core/config/config.service";
import { GroupMaster } from "../models/groupmaster.model";

@Injectable({
  providedIn: 'root'
})
export class GroupMasterService {
  
  constructor(private http: HttpClient, private configService: ConfigService) { }

  // Fetches GroupMaster with pagination
  getGroupMasters(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.GroupMasterUrl, { params });
  }

  // Fetches a single GroupMaster by id
  getGroupMasterById(id: number): Observable<GroupMaster> {
    return this.http.get<GroupMaster>(`${this.configService.GroupMasterUrl}/${id}`);
  }

  // Creates a new GroupMaster
  createGroupMaster(groupmaster: GroupMaster): Observable<GroupMaster> {
    return this.http.post<GroupMaster>(this.configService.GroupMasterUrl, groupmaster);
  }

  // Updates an existing GroupMaster
  updateGroupMaster(id: number, groupmaster: GroupMaster): Observable<GroupMaster> {
    return this.http.put<GroupMaster>(
      `${this.configService.GroupMasterUrl}/${id}`,
      groupmaster
    );
  }

  // Deactivates a GroupMaster
  deactivateGroupMaster(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.GroupMasterUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a GroupMaster
  deleteGroupMaster(id: number): Observable<any> {
    return this.http.delete(`${this.configService.GroupMasterUrl}/${id}`);
  }
}
