import { Injectable } from "@angular/core";
import { UserContext } from "../models/user-context.model";

@Injectable({
  providedIn: "root",
})
export class UserContextService {
  private userContext: UserContext | null = null;
  private token: string | null = null;

  constructor() {
    this.loadUserContext();
  }

  // Method to set the UserContext
  setUserContext(context: UserContext): void {
    this.userContext = context;
  }

  private loadUserContext(): void {
    const token = localStorage.getItem("token");
    if (token) {
      this.token = token;
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode token payload
      this.userContext = new UserContext(payload);
    }
  }

  getUserContext(): UserContext | null {
    return this.userContext;
  }

  getToken(): string | null {
    return this.token;
  }

  clearUserContext(): void {
    this.userContext = null;
  }
}
