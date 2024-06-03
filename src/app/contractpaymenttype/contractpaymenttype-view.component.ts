import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ContractPaymentTypeService } from "./services/contractpaymenttype.service";
import { ContractPaymentType } from "./models/contractpaymenttype.model";

@Component({
  selector: 'app-contractpaymenttype-view',
  templateUrl: "./contractpaymenttype-view.component.html",
})
export class ContractPaymentTypeViewComponent implements OnInit {
  paymenttype: ContractPaymentType = {} as ContractPaymentType;
  loading: boolean = true;

  constructor(
    private contractpaymenttypeService: ContractPaymentTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchPaymentType(id);
    });
  }

  private fetchPaymentType(id: number): void {
    this.contractpaymenttypeService.getContractPaymentTypeById(id).subscribe(
      (paymenttype) => {
        this.paymenttype = paymenttype;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching paymenttype type:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/md/paymenttype"]); // Update this path as needed
  }
}
