import { Component } from "@angular/core";

@Component({
  selector: "app-login-page-footer",
  templateUrl: "./login-page-footer.component.html",
  styleUrls: ["./login-page-footer.component.scss"],
})
export class LoginPageFooterComponent {
  currentYear: number = new Date().getFullYear(); // Adds the current year
  constructor() {}
}
