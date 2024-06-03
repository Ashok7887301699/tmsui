import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { vendorfuelService } from "./services/vendorfuel.service";
import { VendorFuel } from "./models/vendorfuel.model";

@Component({
  selector: 'app-vendorfuel-view',
  templateUrl: "./vendorfuel-view.component.html",
})
export class VendorfuelViewComponent implements OnInit {
  vendorfuel: VendorFuel = {} as VendorFuel;
  loading: boolean = true;

  constructor(
    private vendorfuelService: vendorfuelService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchVendorFuel(id);
    });
  }

  private fetchVendorFuel(id: number): void {
    this.vendorfuelService.getVendorFuelById(id).subscribe(
      (vendorfuel) => {
        this.vendorfuel = vendorfuel;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching vendorfuel type:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/md/vendorfuel"]); // Update this path as needed
  }
}
