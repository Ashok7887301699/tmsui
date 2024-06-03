import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { VehiclecapacitymodelService } from "./services/vehiclecapacitymodel.service";
import { VehicleCapacityModel } from "./models/vehiclecapacitymodel.model";


@Component({
  selector: 'app-vehiclecapacitymodel-view',
  templateUrl: "./vehiclecapacitymodel-view.component.html",
 
})
export class VehiclecapacitymodelViewComponent implements OnInit {
  vehiclecapacitymodel: VehicleCapacityModel = {} as VehicleCapacityModel;
  loading: boolean = true;

  constructor(
    private vehiclecapacitymodelService: VehiclecapacitymodelService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchVehicleCapacityModel(id);
    });
  }

  private fetchVehicleCapacityModel(id: number): void {
    this.vehiclecapacitymodelService.getVehicleCapacityModelById(id).subscribe(
      (vehiclecapacitymodel) => {
        this.vehiclecapacitymodel = vehiclecapacitymodel;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching vehicle capacity model:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/md/vehiclecapacitymodel"]); // Update this path as needed
  }

}
