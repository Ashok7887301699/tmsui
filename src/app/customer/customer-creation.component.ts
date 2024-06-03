import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from "./services/customer.service";


@Component({
  selector: 'app-customer-creation',
  templateUrl: './customer-creation.component.html',
  styles: `.form-container {
    border: 1px solid #ccc; /* Add border */
    border-radius: 5px; /* Add border radius for rounded corners */
    padding: 20px; /* Add padding for spacing inside the container */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add box shadow for depth */
  }
  
  /* Optional: Adjust form elements styling */
  .form-container form {
    display: flex;
    flex-direction: column;
  }
  
  .form-container label {
    font-weight: bold;
    margin-bottom: 10px;
  }
  `
})
export class CustomerCreationComponent implements OnInit {
  customercreationForm!: FormGroup;
  customerGroupCodes: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private CustomerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.fetchgroupcode();
  }

  initForm(): void {
    this.customercreationForm = this.formBuilder.group({
      cust_group_code: ['', Validators.required] // Define cust_group_code FormControl
    });
  }

  // fetchCustomerGroupCodes(): void {
  //   this.customerService.getgroupcode().subscribe(
  //     (response: any[]) => {
  //       this.customerGroupCodes = response.map(item => ({ label: item.label, value: item.value }));
  //     },
  //     (error) => {
  //       console.error("Error fetching customer group codes:", error);
  //     }
  //   );
  // }

  
  // fetchgroupcode() {
  //   this.CustomerService.getgroupcode().subscribe(
  //     (response: any) => {
  //       console.log("Response:", response); // Log the response to see its structure
  //       if (Array.isArray(response)) {
  //         this. customerGroupCodes= response.map((item: string) => ({
  //           label: item,
  //           value: item,
  //         }));
  //       } else if (response && Array.isArray(response.groupcode)) {
  //         this.customerGroupCodes = response.groupcode.map(
  //           (item: string) => ({ label: item, value: item })
  //         );
  //       } else {
  //         console.error("Invalid response format:", response);
  //       }
  //     },
  //     (error) => {
  //       console.error("Error fetching vehicle types:", error);
  //     }
  //   );
  // }

  fetchgroupcode() {
    this.CustomerService.getgroupcode().subscribe(
      (response: any) => {
        console.log("Response:", response); // Log the response to see its structure
        if (Array.isArray(response)) {
          this.customerGroupCodes = response.map((item: any) => ({
            label: `${item.groupcode}-${item.groupname}`, // Combine groupcode and groupname
            value: item.groupcode, // Set the value to groupcode
          }));
        } else if (response && Array.isArray(response.groupcode)) {
          this.customerGroupCodes = response.groupcode.map((item: any) => ({
            label: `${item.groupcode}-${item.groupname}`, // Combine groupcode and groupname
            value: item.groupcode, // Set the value to groupcode
          }));
        } else {
          console.error("Invalid response format:", response);
        }
      },
      (error) => {
        console.error("Error fetching group codes:", error);
      }
    );
  }
  

  onSubmit(): void {
    if (this.customercreationForm.valid) {
      const selectedCustGroupCode = this.customercreationForm.value.cust_group_code;
      // Redirect to CustomerFormComponent with selected custgroupcode as query parameter
      this.router.navigate(['/md/customers/create'], { queryParams: { custgroupcode: selectedCustGroupCode } });
    }
  }
}
