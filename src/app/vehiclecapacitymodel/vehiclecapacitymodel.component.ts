import { Component } from '@angular/core';
import { BreadcrumbService } from "../core/config/breadcrumb.service"; // Update the path as needed
import { MenuItem } from "primeng/api"; // Import MenuItem

@Component({
  selector: 'app-vehiclecapacitymodel',
  templateUrl: './vehiclecapacitymodel.component.html',
  
})
export class VehiclecapacitymodelComponent {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {}

}
