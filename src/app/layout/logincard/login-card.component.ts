import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-login-card",
  templateUrl: "./login-card.component.html",
  styleUrls: ["./login-card.component.scss"],
})
export class LoginCardComponent {
  tenantId!: number;
  loginId!: string;
  password!: string;

  @Output() signIn = new EventEmitter<{
    tenantId: number;
    loginId: string;
    password: string;
  }>();

  constructor() {}

  onSignIn() {
    this.signIn.emit({
      tenantId: this.tenantId,
      loginId: this.loginId,
      password: this.password,
    });
  }
}
