import { Component } from '@angular/core';
import { BreadcrumbService } from "../core/config/breadcrumb.service"; // Update the path as needed
import { MenuItem } from "primeng/api"; // Import MenuItem

@Component({
  selector: 'app-producttype',
  templateUrl: './producttype.component.html',
  
})
export class ProducttypeComponent {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {}

}
