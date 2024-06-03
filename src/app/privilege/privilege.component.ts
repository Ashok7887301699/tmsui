import { Component } from '@angular/core';
import { BreadcrumbService } from "../core/config/breadcrumb.service"; // Update the path as needed
import { MenuItem } from "primeng/api"; // Import MenuItem


@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html',
 
 
})
export class PrivilegeComponent {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {}


}
