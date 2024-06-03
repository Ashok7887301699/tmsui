import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api"; // Import MenuItem
import { BreadcrumbService } from "../core/config/breadcrumb.service"; // Update the path as needed

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];

  constructor() {}

  ngOnInit() {
    this.breadcrumbItems = [
      { icon: "pi pi-fw pi-home", label: "Home", url: "/home" },
    ];
  }
}
