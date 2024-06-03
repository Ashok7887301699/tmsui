import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from "../core/config/breadcrumb.service";

@Component({
  selector: 'app-contractpaymenttype',
  templateUrl: "./contractpaymenttype.component.html"
})
export class ContractPaymentTypeComponent implements OnInit {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    
  }
}
