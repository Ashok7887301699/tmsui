import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { ConfigService } from "../config/config.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Intercepting our backend RESTful API requests
    if (req.url.startsWith(this.configService.apiUrl)) {
      // Checking if the request URL ends with the auth endpoint
      if (req.url.endsWith(this.configService.authEndPoint)) {
        return next.handle(req);
      }

      const authToken = localStorage.getItem("token");
      const authReq = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + authToken),
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
