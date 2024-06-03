import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from "../core/config/breadcrumb.service";

@Component({
  selector: 'app-ls',
  templateUrl: "./ls.component.html",

  styles: ``
})
export class LsComponent implements OnInit {
  constructor(private breadcrumbService: BreadcrumbService) {}
  ngOnInit(): void {
    
  }
}
