import { Component } from '@angular/core';
import { BreadcrumbService } from "../core/config/breadcrumb.service"; // Update the path as needed
import { MenuItem } from "primeng/api"; // Import MenuItem


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
 
})
export class RoleComponent {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {}

}
