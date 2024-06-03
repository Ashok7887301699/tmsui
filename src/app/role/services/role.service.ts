import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ConfigService } from "../../core/config/config.service";
import { Role } from "../models/role.model";


@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private privilegesUrl = 'your_backend_url/privileges';
  constructor(private http: HttpClient, private configService: ConfigService) { }

  // Fetches Role with pagination
  getRoles(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.roleUrl, { params });
  }

  // Fetches a single Role by id
  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.configService.roleUrl}/${id}`);
  }

  // Creates a new Role
  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.configService.roleUrl, role);
  }

  // Updates an existing Role
  updateRole(id: number, role: Role): Observable<Role> {
    return this.http.put<Role>(
      `${this.configService.roleUrl}/${id}`,
      role
    );
  }

  // Deactivates a Role
  deactivateRole(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.roleUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a Role
  deleteRole(id: number): Observable<any> {
    return this.http.delete(`${this.configService.roleUrl}/${id}`);
  }

   // Create role privileges
   createRolePrivileges(roleId: number, privilegeIds: number[]): Observable<any> {
    const rolePrivilegeData = {
      role_id: roleId,
      privilege_ids: privilegeIds
    };
    return this.http.post<any>(`${this.configService.roleUrl}/roleprivilege`, rolePrivilegeData);
  }
  
}
