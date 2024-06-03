import { Component, Input } from '@angular/core';
import { ContractPaymentType } from "./models/contractpaymenttype.model";

@Component({
  selector: 'app-contractpaymenttype-detail',
  templateUrl: './contractpaymenttype-detail.component.html',
  
})
export class ContractPaymentTypeDetailComponent {
  @Input() paymenttype: ContractPaymentType | null = null; 
}
