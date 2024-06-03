import { Component } from '@angular/core';
import { BreadcrumbService } from "../core/config/breadcrumb.service"; // Update the path as needed
import { MenuItem } from "primeng/api"; // Import MenuItem
@Component({
  selector: 'app-groupmaster',
  templateUrl: './groupmaster.component.html',
})
export class GroupmasterComponent {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {}


}
