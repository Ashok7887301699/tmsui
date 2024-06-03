import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from "../core/config/breadcrumb.service";

@Component({
  selector: 'app-verifypodandvoucher',
  templateUrl: './verifypodandvoucher.component.html',

})
export class VerifypodandvoucherComponent implements OnInit {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    
  }

}



