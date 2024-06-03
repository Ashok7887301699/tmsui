import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./services/auth.interceptor";
import { AuthService } from "./auth/auth.service";
import { ConfigService } from "./config/config.service";
import { EnvService } from "./config/env.service";
import { BreadcrumbService } from "./config/breadcrumb.service"; // Import BreadcrumbService

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    AuthService,
    ConfigService,
    EnvService,
    BreadcrumbService, // Add BreadcrumbService to the providers array
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
