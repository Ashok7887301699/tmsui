// src/app/tenant/tenant-detail.component.ts

import { Component, Input, OnInit } from "@angular/core";
import { Tenant } from "./models/tenant.model";

@Component({
  selector: "app-tenant-detail",
  templateUrl: "./tenant-detail.component.html",
})
export class TenantDetailComponent implements OnInit {
  @Input() tenant: Tenant | null = null;

  ngOnInit(): void {
console.log(this.tenant);
  }
}
