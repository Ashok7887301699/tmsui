import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ConfigService } from "../config/config.service";
import { UserContextService } from "../services/user-context.service";
import { UserContext } from "../models/user-context.model";

export interface AuthResponse {
  token: string;
  // ... include other relevant fields if needed
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // BehaviorSubject to hold the current authentication status
  private authStatusSource = new BehaviorSubject<boolean>(this.isLoggedIn());
  // Observable to be used by components to react to authentication status changes
  authStatus = this.authStatusSource.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private userContextService: UserContextService // Inject UserContextService
  ) {}

  // Handles user login
  login(
    tenantId: number,
    loginId: string,
    password: string
  ): Observable<AuthResponse> {
    const requestPayload = {
      tenant_id: tenantId,
      login_id: loginId,
      password: password,
    };
    const loginUrl = this.configService.authUrl; // Using ConfigService for URL
    return this.http.post<AuthResponse>(loginUrl, requestPayload).pipe(
      tap((response) => {
        // When the user logs in successfully, set the session and update the auth status
        this.setSession(response);
        this.authStatusSource.next(true); // Emit that the user is authenticated
      })
    );
  }

  // Sets user session after successful login
  private setSession(authResult: AuthResponse) {
    localStorage.setItem("token", authResult.token); // Store the token
    const payload = JSON.parse(atob(authResult.token.split(".")[1])); // Decode token payload
    this.userContextService.setUserContext(new UserContext(payload)); // Set UserContext
  }

  // Handles user logout
  logout() {
    localStorage.removeItem("token"); // Remove the token from storage
    this.userContextService.clearUserContext(); // Clear UserContext
    this.authStatusSource.next(false); // Emit that the user is not authenticated
  }

  // Checks if the user is logged in by verifying the presence of the token
  public isLoggedIn(): boolean {
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token; // Presence of token indicates logged in status
    //this.authStatusSource.next(isLoggedIn); // Emit the current auth status
    return isLoggedIn;
  }

  // Additional methods as needed...
}
