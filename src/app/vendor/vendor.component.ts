import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from "../core/config/breadcrumb.service";

@Component({
  selector: 'app-vendor',
  templateUrl: "./vendor.component.html",
})
export class VendorComponent implements OnInit {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    
  }
}
