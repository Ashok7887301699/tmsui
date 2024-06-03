// stapp/src/app/layout/loginpageheader/login-page-header.component.ts

import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api";
import { EnvService } from "../../core/config/env.service"; // Import EnvService

@Component({
  selector: "app-login-page-header",
  templateUrl: "./login-page-header.component.html",
  styleUrls: ["./login-page-header.component.scss"],
})
export class LoginPageHeaderComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private envService: EnvService) {} // Inject EnvService

  ngOnInit(): void {
    this.items = this.createMenuItems();
  }

  private createMenuItems(): MenuItem[] {
    const menuItems: MenuItem[] = [];
    for (const appName in this.envService.apps) {
      if (this.envService.apps.hasOwnProperty(appName)) {
        const appUrl =
          this.envService.apps[appName as keyof typeof this.envService.apps]; // Type assertion
        menuItems.push({
          label: appName,
          command: () => {
            window.open(appUrl, "_blank"); // Open the app in a new tab
          },
        });
      }
    }
    return menuItems;
  }
}
