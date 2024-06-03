import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Branch } from "../models/branch.model";
import { ConfigService } from "../../core/config/config.service";

@Injectable({
  providedIn: "root",
})
export class BranchService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Fetches branch types
  getBranchTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.configService.BranchtypeUrl}/bt`);
  }

  // Fetches branchs with pagination
  getBranches(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.branchUrl, { params });
  }

  // Fetches a single branch by BranchCode
  getBranchByCode(BranchCode: string): Observable<Branch> {
    console.log("Branch code :", BranchCode);
    return this.http.get<Branch>(
      `${this.configService.branchUrl}/${BranchCode}`
    );
  }

  // Update branch with FormData
  updateBranch(BranchCode: string, formData: FormData): Observable<Branch> {
    console.log("HIIIIII",formData);
    return this.http.put<Branch>(
      `${this.configService.branchUrl}/${BranchCode}`,
      formData
    );
  }

  // Create branch with FormData
  createBranch(formData: FormData): Observable<Branch> {
    return this.http.post<Branch>(this.configService.branchUrl, formData);
  }

  // Creates a new branch
  // createBranch(branch: Branch): Observable<Branch> {
  //   console.log("branch :", branch);
  //   return this.http.post<Branch>(this.configService.branchUrl, branch);
  // }

  // // Updates an existing branch
  // updateBranch(BranchCode: string, branch: Branch): Observable<Branch> {
  //   console.log("Branch code :", BranchCode);
  //   return this.http.put<Branch>(
  //     `${this.configService.branchUrl}/${BranchCode}`,
  //     branch
  //   );
  // }

  // Deactivates a branch
  deactivateBranch(BranchCode: string): Observable<any> {
    console.log("Branch code :", BranchCode);
    return this.http.patch(
      `${this.configService.branchUrl}/${BranchCode}/deactivate`,
      null
    );
  }

  // Deletes a branch
  deleteBranch(BranchCode: string): Observable<any> {
    console.log("Branch code :", BranchCode);
    return this.http.delete(`${this.configService.branchUrl}/${BranchCode}`);
  }

  getBranchCodes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.configService.branchUrl}/codes`);
  }
}
