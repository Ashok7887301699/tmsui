import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from "../core/config/breadcrumb.service";

@Component({
  selector: 'app-hamali',
  templateUrl: "./hamali.component.html",
})
export class HamaliComponent implements OnInit {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    
  }
}
