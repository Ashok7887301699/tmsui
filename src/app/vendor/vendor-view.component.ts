import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { VendorService } from "./services/vendor.service";
import { Vendor } from "./models/vendor.model";

@Component({
  selector: 'app-vendor-view',
  templateUrl: "./vendor-view.component.html",
})
export class VendorViewComponent implements OnInit {
  vendor: Vendor = {} as Vendor;
  loading: boolean = true;

  constructor(
    private vendorService: VendorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchVendor(id);
    });
  }

  private fetchVendor(id: number): void {
    this.vendorService.getVendorById(id).subscribe(
      (vendor) => {
        this.vendor = vendor;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching vendor type:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/md/vendor"]); // Update this path as needed
  }
}
