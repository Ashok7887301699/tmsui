import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Vehicle } from './models/vehicle.model';
import { VehicleService } from './services/vehicle.service';
@Component({
  selector: 'app-vehicle-view',
  templateUrl: "./vehicle-view.component.html",
  styles: ``
})
export class VehicleViewComponent implements OnInit   {
  vehicle: Vehicle = {} as Vehicle;
  loading: boolean = true;

  
  constructor(
    private VehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const SrNo = params["SrNo"];
      if (SrNo) {
        this.fetchVehicle(SrNo);
      }
    });
  }



  
  private fetchVehicle(SrNo: number): void {
    if (!SrNo) {
      console.error("SAP vehicle code is undefined");
      this.loading = false;
      return;
    }
  
    this.VehicleService.getVehicleById(SrNo).subscribe(
      (response:any) => {
        this.vehicle = response.vehicle;
        console.log("vehicle",this.vehicle);
        console.log("response",response);
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching customer type:", error);
        this.loading = false;
      }
    );
  }
  

  goBack(): void {
    this.router.navigate(["/md/vehicle"]); // Update this path as needed
  }

}
