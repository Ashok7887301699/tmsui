import { Component } from '@angular/core';
import { BreadcrumbService } from "../core/config/breadcrumb.service"; // Update the path as needed
import { MenuItem } from "primeng/api"; // Import MenuItem

@Component({
  selector: 'app-customer',
  templateUrl: "./customer.component.html",
  styles: ``
})
export class CustomerComponent {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {}
}
