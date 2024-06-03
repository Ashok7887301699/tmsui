// src/app/tenant/tenant-view.component.ts

import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TenantService } from "./services/tenant.service";
import { Tenant } from "./models/tenant.model";

@Component({
  selector: "app-tenant-view",
  templateUrl: "./tenant-view.component.html",
})
export class TenantViewComponent implements OnInit {
  tenant: Tenant = {} as Tenant;
  loading: boolean = true;

  constructor(
    private tenantService: TenantService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchTenant(id);
    });
  }

  private fetchTenant(id: number): void {
    this.tenantService.getTenantById(id).subscribe(
      (tenant) => {
        this.tenant = tenant;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching tenant:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/md/tenants"]);
  }
}
