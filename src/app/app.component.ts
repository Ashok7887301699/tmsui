import { Component, OnInit } from "@angular/core";
import { AuthService } from "./core/auth/auth.service";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "stapp";
  isAuthenticated = false;

  // Inject AuthService and Router into your component
  constructor(private authService: AuthService, private router: Router) {
    // Subscribe to authentication status changes
    this.authService.authStatus.subscribe((status: boolean) => {
      // Update isAuthenticated when the auth status changes
      this.isAuthenticated = status;
    });
  }

  ngOnInit() {
    // Check the current authentication status on app initialization
    this.isAuthenticated = this.authService.isLoggedIn();

    // React to navigation events to reset the authentication status if needed
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        // If we've navigated to the login route, update isAuthenticated
        if (event.urlAfterRedirects === "/") {
          this.isAuthenticated = false;
        }
      });
  }

  // Function to call when the user submits the login form
  onSignIn(credentials: {
    tenantId: number;
    loginId: string;
    password: string;
  }) {
    // Call the login method of AuthService with the provided credentials
    this.authService
      .login(credentials.tenantId, credentials.loginId, credentials.password)
      .subscribe({
        next: (response) => {
          // If we receive a token, the login is successful
          if (response.token) {
            // Set isAuthenticated to true on successful login
            this.isAuthenticated = true;
            // Store the token in local storage
            localStorage.setItem("token", response.token);
            // Navigate to the home page
            this.router.navigate(["/home"]);
          } else {
            // Log an error if no token was received
            console.error("Login failed: No token received");
          }
        },
        error: (err) => {
          // Log an error if the login call failed
          console.error("Login failed:", err);
        },
      });
  }
}
