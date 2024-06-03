import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DriverService } from "./services/driver.service";
import { Driver } from "./models/driver.model";

@Component({
  selector: "app-driver-view",
  templateUrl: "./driver-view.component.html",
})
export class DriverViewComponent implements OnInit {
  driver: Driver = {} as Driver;
  loading: boolean = true;

  constructor(
    private driverService: DriverService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchDriver(id);
    });
  }

  private fetchDriver(id: number): void {
    this.driverService.getDriverById(id).subscribe(
      (driver) => {
        this.driver = driver;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching driver:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/md/drivermaster"]);
  }
}
