import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user.model";
import { ConfigService } from "../../core/config/config.service";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private configService: ConfigService) {}

  getRoleNames(): Observable<string[]> {
    // Assuming the endpoint for fetching role names is /roles/names
    const endpoint = `${this.configService.roleUrl}/names`;
    return this.http.get<string[]>(endpoint);
  }

  // Fetches Users with pagination
  getUsers(page: number, perPage: number, filters: any, sortBy: string, sortOrder: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    // Add filter parameters
    for (const key in filters) {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.userUrl, { params });
  }
   

  // Fetches a single User by id
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.configService.userUrl}/${id}`);
  }

  // Creates a new User
  createUser(formData: FormData): Observable<User> {
    return this.http.post<User>(this.configService.userUrl, formData);
  }

  // Updates an existing User
  updateUser(id: number,formData: FormData): Observable<User> {
    console.log("HIIIIII",formData);
    return this.http.put<User>(
      `${this.configService.userUrl}/${id}`,formData);
  }

  // Deactivates a user
  deactivateUser(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.userUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a user
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.configService.userUrl}/${id}`);
  }
  getdepotname(): Observable<any[]> {
    const endpoint = `${this.configService.userUrl}/fetchdeponame`; // Updated endpoint
 
    return this.http.get<any[]>(endpoint);
    }

}
