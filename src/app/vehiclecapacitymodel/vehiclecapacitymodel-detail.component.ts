import { Component, Input, OnInit } from '@angular/core';
import { VehicleCapacityModel } from './models/vehiclecapacitymodel.model';

@Component({
  selector: 'app-vehiclecapacitymodel-detail',
  templateUrl: "./vehiclecapacitymodel-detail.component.html",
})
export class VehiclecapacitymodelDetailComponent implements OnInit {
  @Input() vehiclecapacitymodel: VehicleCapacityModel | null = null;

  ngOnInit(): void {
    // Additional initialization if needed
  }

}
