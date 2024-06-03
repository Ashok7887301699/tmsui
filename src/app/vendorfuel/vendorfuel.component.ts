import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from "../core/config/breadcrumb.service";

@Component({
  selector: 'app-vendorfuel',
  templateUrl: "./vendorfuel.component.html",
})
export class VendorfuelComponent implements OnInit {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    
  }
}
