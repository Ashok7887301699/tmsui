import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { customer } from './models/customer.model';
import { CustomerService } from './services/customer.service';
@Component({
  selector: 'app-customer-view',
  templateUrl: "./customer-view.component.html",
  styles: ``
})
export class CustomerViewComponent implements OnInit  {

  customer: customer = {} as customer;
  loading: boolean = true;

  

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const sap_cust_code = params["sap_cust_code"];
      if (sap_cust_code) {
        this.fetchCustomer(sap_cust_code);
      }
    });
  }
  

  private fetchCustomer(sap_cust_code: string): void {
    if (!sap_cust_code) {
      console.error("SAP customer code is undefined");
      this.loading = false;
      return;
    }
  
    this.customerService.getCustomerById(sap_cust_code).subscribe(
      (response:any) => {
        this.customer = response.customer;
        console.log("customer",this.customer);
        console.log("response",response);
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching customer type:", error);
        this.loading = false;
      }
    );
  }
  

  goBack(): void {
    this.router.navigate(["/md/customers/list"]); // Update this path as needed
  }


}


