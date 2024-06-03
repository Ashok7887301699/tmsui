import { Component } from '@angular/core';
import { BreadcrumbService } from "../core/config/breadcrumb.service"; // Update the path as needed
import { MenuItem } from "primeng/api"; // Import MenuItem;

@Component({
  selector: 'app-industrytype',
  templateUrl: './industrytype.component.html',
})
export class IndustrytypeComponent {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {}

}
