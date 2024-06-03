import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ConfigService } from "../../core/config/config.service";
import { Privilege } from "../models/privilege.model";


@Injectable({
  providedIn: 'root'
})
export class PrivilegeService {

  constructor(private http: HttpClient, private configService: ConfigService) { }

  // Fetches Privilege with pagination
  getPrivileges(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.privilegeUrl, { params });
  }

  // Fetches a single Privilege by id
  getPrivilegeById(id: number): Observable<Privilege> {
    return this.http.get<Privilege>(`${this.configService.privilegeUrl}/${id}`);
  }

  // Creates a new Privilege
  createPrivilege(privilege: Privilege): Observable<Privilege> {
    return this.http.post<Privilege>(this.configService.privilegeUrl, privilege);
  }

  // Updates an existing Privilege
  updatePrivilege(id: number, privilege: Privilege): Observable<Privilege> {
    return this.http.put<Privilege>(
      `${this.configService.privilegeUrl}/${id}`,
      privilege
    );
  }

  // Deactivates a Privilege
  deactivatePrivilege(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.privilegeUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a Privilege
  deletePrivilege(id: number): Observable<any> {
    return this.http.delete(`${this.configService.privilegeUrl}/${id}`);
  }
// Fetches only the name and description of privileges
getPrivilegeanddescriptions(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:8000/stapi/v1/role/privileges');
}
getPrivilegeIds(): Observable<number[]> {
  return this.http.get<number[]>(`${this.configService.privilegeUrl}/ids`);
}
}
