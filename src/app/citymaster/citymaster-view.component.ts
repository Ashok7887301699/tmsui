import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CityMasterService } from "./services/citymaster.service";
import { CityMaster } from "./models/citymaster.model";

@Component({
  selector: 'app-citymaster-view',
  templateUrl: "./citymaster-view.component.html",
})
export class CitymasterViewComponent implements OnInit {
  citymaster: CityMaster = {} as CityMaster;
  loading: boolean = true;

  constructor(
    private cityMasterService: CityMasterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchCityMaster(id);
    });
  }

  private fetchCityMaster(id: number): void {
    this.cityMasterService.getCityMasterById(id).subscribe(
      (citymaster) => {
        this.citymaster = citymaster;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching city master:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/md/citymasters"]); // Update this path as needed
  }
}
