// content-header.component.ts
import { Component, OnInit } from "@angular/core";
import { UserContextService } from "../../core/services/user-context.service";
import { UserContext } from "../../core/models/user-context.model";
import { AuthService } from "../../core/auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-content-header",
  templateUrl: "./content-header.component.html",
  //styleUrls: ["./content-header.component.scss"],
})
export class ContentHeaderComponent implements OnInit {
  userContext: UserContext | null = null;

  constructor(
    private userContextService: UserContextService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userContext = this.userContextService.getUserContext();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/"]);
  }
}
