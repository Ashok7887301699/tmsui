import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api"; // Import MenuItem
import { BreadcrumbService } from "../core/config/breadcrumb.service"; // Update the path as needed

@Component({
  selector: "app-tenant",
  templateUrl: "./tenant.component.html",
})
export class TenantComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
