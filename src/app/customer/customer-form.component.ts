import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerService } from "./services/customer.service";
import { customer } from "./models/customer.model";
import { DatePipe } from "@angular/common";
import * as XLSX from "xlsx";
import { UserContext } from "../core/models/user-context.model";

@Component({
  selector: "app-customer-form",
  templateUrl: "./customer-form.component.html",
  styles: `.cursor-no-drop {
    cursor: no-drop;
  }
  .checkbox-container {
    display: flex;
    flex-wrap: wrap;
}

.checkbox-item {
    margin-right: 20px; /* Adjust margin as needed */
}
.cursor-no-drop {
      cursor: no-drop;
    }
    .verification-message {
  display: block;
  text-align: center;
  margin-top: 5px;
  font-weight: bold;
}

.valid {
  color: green;
}

.invalid {
  color: red;
}

  `
})
export class CustomerFormComponent implements OnInit {
  // cancel() {
  //   this.router.navigate(["/md/customers"]);
  // }

  cancel() {
    this.router.navigate(["/md/customers/list"]); // Redirect to the list component
  }

  form:any
  uploadcustomerForm!: FormGroup;
  customerForm: FormGroup;
  isEditMode: boolean = false;
  SapCustCode: string | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedcustomer: customer | null = null; // Store the tenant data after successful operation
  errorMessage: string = ""; // Store error message
  IndTypeOptions: any[] = [];
  deponameOptions:any[]=[];
  fullName: string = '';
  panNumber: string = '';
  verificationStatus: string = ''; // Variable to hold verification status
  verificationMessage: string = ''; // Variable to hold verification message
  existingCustomerCodes: customer[] = [];
  //customerGroupCodes: any[] = []; // Populate this with customer group codes from backend
 // showAdditionalFields: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private customerservice: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {
    this.customerForm = this.fb.group({
      tms_cust_group_code: [''],
      sap_cust_code: ["", Validators.required],
      sap_cust_grp_code: ["", Validators.required],
    //  CostCenter: [""],
      CustName: ["", Validators.required],
      Category: ['', Validators.required],
      MobileNo: ['', [Validators.required, this.tenDigitValidator()]], 
      PAN: ['', Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)],
      GST_No: ["", Validators.required],
      City: ["", Validators.required],
      Pincode: ["", Validators.required],
      Location: ["", Validators.required],
      TelNo: ["", Validators.required],
      Address: ["", Validators.required],
      
      sap_ind_type: ["", Validators.required],
      CustNameMar: ["", Validators.required],
      AddressMar: ["", Validators.required],
      BillAddressMar: ["", Validators.required],
      BillingMail: ["", Validators.required],
      BillingMobileNo: ["", Validators.required],
      BiillingPerson: ["", Validators.required],
      Status: ["1", Validators.required],
      sap_depot_name: ["", Validators.required],
      CreatedBy: ["", Validators.required],
      SalesReference: ["", Validators.required],
      sap_create_date: [new Date(), Validators.required],
    });
    // Initialize the steps
    this.steps = [{ label: "Customer Form" }, { label: "Customer Details" }];
  }
  categoryOptions = [
    { label: 'PAID', value: 'PAID' },
    { label: 'TO PAY', value: 'TO PAY' },
    { label: 'TBB', value: 'TBB' }
  ];

  eventArray: any[] = [];

  // Function to handle checkbox change event
  // onCheckboxChange(event: any, optionValue: string) {
  //   console.log('Event:', event); // Check the event object
  //   console.log('Option Value:', optionValue); // Check the option value
  //   if (event.checked) {
  //     // Push the value of the checked checkbox onto the array
  //     this.eventArray.push(optionValue);
  //   } else {
  //     // Remove the value of the unchecked checkbox from the array
  //     const index = this.eventArray.indexOf(optionValue);
  //     if (index !== -1) {
  //       this.eventArray.splice(index, 1);
  //     }
  //   }
    
  //   // Convert the selected checkboxes into a comma-separated string
  //   const selectedCategoriesString = this.eventArray.join(', ');
    
  //   console.log('Selected Categories:', selectedCategoriesString); // Log the selected categories
  // }

  tenDigitValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;
      
      // Check if value is a 10-digit number and doesn't start with 1, 2, 3, 4, 5, or 6
      if (value && /^\d{10}$/.test(value) && !/^[1-6]/.test(value)) {
        return null; // Return null if validation passes
      }
      
      return { invalidMobile: true }; // Return error if the mobile number is invalid
    };
  }
  

  onCheckboxChange(event: any, optionValue: string) {
    console.log('Event:', event); // Check the event object
    console.log('Option Value:', optionValue); // Check the option value
    
    // Check if the option is checked
    if (event.checked) {
      // Check if the option is already present in the array
      if (!this.eventArray.includes(optionValue)) {
        // If not present, push the value of the checked checkbox onto the array
        this.eventArray.push(optionValue);
      }
    } else {
      // Remove the value of the unchecked checkbox from the array
      const index = this.eventArray.indexOf(optionValue);
      if (index !== -1) {
        this.eventArray.splice(index, 1);
      }
    }
    
    // Convert the selected checkboxes into a comma-separated string
    const selectedCategoriesString = this.eventArray.join(', ');
    
    console.log('Selected Categories:', selectedCategoriesString); // Log the selected categories
  }
  


  fetchFullNameFromPAN(): void {
    const panValue = this.customerForm.get('PAN')!.value;
    // Check if PAN format is valid
    if (this.customerForm.get('PAN')!.valid) {
      this.customerservice.getPanDetails(panValue).subscribe(
        (response) => {
          this.fullName = response?.data?.full_name || 'Not Found'; // Extract full name from response
          // Set the retrieved full name in the CustName field
          this.customerForm.patchValue({ CustName: this.fullName });
          this.verificationStatus = 'Verified'; // Set verification status
          this.verificationMessage = 'PAN is valid'; // Set verification message
          this.getExistingCustomerCodes();
        },
        (error) => {
          console.error('Error fetching PAN details:', error);
          this.fullName = ''; // Reset full name
          this.customerForm.patchValue({ CustName: '' }); // Clear CustName field
          this.verificationStatus = 'Invalid'; // Set verification status
          this.verificationMessage = 'PAN is invalid'; // Set verification message
        }
      );
    } else {
      this.verificationStatus = 'Invalid'; // Set verification status
      this.verificationMessage = 'Invalid PAN format'; // Set verification message
    }
  }


  // fetchFullNameFromPAN(): void {
  //   const panValue = this.customerForm.get('PAN')!.value;
  
  //   // Check if PAN format is valid
  //   if (this.customerForm.get('PAN')!.valid && !this.isEditMode) {
  //     // Call the service method to check PAN existence
  //     this.customerservice.checkPANExists(panValue).subscribe(
  //       (panExists: boolean) => {
  //         if (panExists) {
  //           // PAN exists, display message and reset form
  //           this.verificationStatus = 'Invalid'; // Set verification status
  //           this.verificationMessage = 'PAN already exists'; // Set verification message
  //           this.customerForm.get('PAN')!.setValue(''); // Clear PAN textbox
  //         } else {
  //           // PAN does not exist, proceed to fetch PAN details
  //           this.customerservice.getPanDetails(panValue).subscribe(
  //             (response) => {
  //               this.fullName = response?.data?.full_name || 'Not Found'; // Extract full name from response
  //               // Set the retrieved full name in the CustName field
  //               this.customerForm.patchValue({ CustName: this.fullName });
  //               this.verificationStatus = 'Verified'; // Set verification status
  //               this.verificationMessage = 'PAN is valid'; // Set verification message
  //               this.getExistingCustomerCodes();
  //             },
  //             (error) => {
  //               console.error('Error fetching PAN details:', error);
  //               this.fullName = ''; // Reset full name
  //               this.customerForm.patchValue({ CustName: '' }); // Clear CustName field
  //               this.verificationStatus = 'Invalid'; // Set verification status
  //               this.verificationMessage = 'PAN is invalid'; // Set verification message
  //             }
  //           );
  //         }
  //       },
  //       (error) => {
  //         console.error('Error checking PAN existence:', error);
  //         // Handle error if necessary
  //       }
  //     );
  //   } else {
  //     this.verificationStatus = 'Invalid'; // Set verification status
  //     this.verificationMessage = 'Invalid PAN format'; // Set verification message
  //   }
  // }
  
  
  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const custGroupCode = params['custgroupcode']; // Retrieve query parameter value
      if (custGroupCode) {
        this.customerForm.patchValue({ sap_cust_grp_code: custGroupCode }); // Set initial value for sap_cust_grp_code
      }
    });

    this.route.params.subscribe((params) => {
      if (params["sap_cust_code"]) {
        this.isEditMode = true;
        this.SapCustCode = params["sap_cust_code"];
        console.log("urlsapcode", this.SapCustCode);
        if (this.SapCustCode !== null) {
          this.loadCustomerData(this.SapCustCode);
        }
      }
    });
    this.fetchIndType();
    this.fetchdeponame();
    this.getExistingCustomerCodes();
    // this.fetchgroupcode();

    this.customerForm
    .get("CustName")
    ?.valueChanges.subscribe((value: string) => {
      // Translate the value from English to Marathi
      this.translateCustName(value);
    });
    this.customerForm.get("Address")?.valueChanges.subscribe((value: string) => {
      // Translate the value from English to Marathi
      this.translateAddress(value);
    });
  }

// Function to translate city name from English to Marathi using Google Translate API
translateCustName(CustName: string): void {
  // Construct the URL for Google Translate API
  const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=mr&dt=t&q=${encodeURIComponent(
    CustName
  )}`;

  // Make a GET request to the Google Translate API
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Extract the translated city name from the response
      const translatedCityName = data[0][0][0];
      // Update the CityNameMar field with the translated value
      this.customerForm.get("CustNameMar")?.setValue(translatedCityName);
    });
}


translateAddress(Address: string): void {
  // Construct the URL for Google Translate API
  const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=mr&dt=t&q=${encodeURIComponent(
    Address
  )}`;

  // Make a GET request to the Google Translate API
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Extract the translated city name from the response
      const translatedCityName = data[0][0][0];
      // Update the CityNameMar field with the translated value
      this.customerForm.get("AddressMar")?.setValue(translatedCityName);
    });
}

  statusOptions = [
    // { label: "NONE", value: null }
    { label: "ACTIVE", value: "1" },
    // { label: "DEACTIVATED", value: "0" },
  ];

  loadCustomerData(sap_cust_code: string): void {
    this.customerservice.getCustomerById(sap_cust_code).subscribe(
      (response: any) => {
        const customer = response.customer; // Extract the customer object from the response
        this.fetchIndType();
        this.fetchdeponame();
        console.log("Fetched Customer Data:", customer);
        const sapCreateDate = new Date(customer.sap_create_date);

        // Format the date as mm/dd/yyyy
        const formattedDate = `${(sapCreateDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${sapCreateDate
          .getDate()
          .toString()
          .padStart(2, "0")}/${sapCreateDate.getFullYear()}`;

        console.log("Fetched date :", formattedDate);
        const statusLabel = customer.Status === "1" ? "ACTIVE" : "DEACTIVATED";

        // Patch the form with the relevant properties
        this.customerForm.patchValue({
          sap_cust_code: customer.sap_cust_code,
          sap_cust_grp_code: customer.sap_cust_grp_code,
          CostCenter: customer.CostCenter,
          CustName: customer.CustName,
         // Category: customer.Category,
          MobileNo: customer.MobileNo,
          PAN: customer.PAN,
          GST_No: customer.GST_No,
          City: customer.City,
          Pincode: customer.Pincode,
          Location: customer.Location,
          TelNo: customer.TelNo,
          Address: customer.Address,
          sap_ind_type: customer.sap_ind_type,
          CustNameMar: customer.CustNameMar,
          AddressMar: customer.AddressMar,
          BillAddressMar: customer.BillAddressMar,
          BillingMail: customer.BillingMail,
          BillingMobileNo: customer.BillingMobileNo,
          BiillingPerson: customer.BiillingPerson,
          sap_depot_name: customer.sap_depot_name,
          CreatedBy: customer.CreatedBy,
          SalesReference: customer.SalesReference,
          sap_create_date: formattedDate,
          Status: statusLabel,
          Category: customer.Category.split(',')
          // Patch other properties as needed
        });
        
  
        this.eventArray = customer.Category.split(',');
        console.log("Form after patch:", this.customerForm.value);

        this.isEditMode = true;
        const selectedOption = this.statusOptions.find(
          (option) => option.label === statusLabel
        );
        if (selectedOption) {
          const statusControl = this.customerForm.get("Status");
          if (statusControl) {
            statusControl.setValue(selectedOption.value);
          }
        }
        // const categoryValues: string[] = customer.Category.split(',');
        // const control = this.customerForm.get('Category');
        // if (control) {
        //   categoryValues.forEach((value) => {
        //     control.setValue([...control.value, value]);
        //   });
        // }
      },
      (error) => {
        this.handleError(error);
      }
    );
  }
  

  // getExistingCustomerCodes(): void {
  //   this.customerservice.getExistingCustomerCodes().subscribe(
  //     (response) => {
  //       if (Array.isArray(response)) {
  //         this.existingCustomerCodes = response.map(code => code.sap_cust_code);
  //         console.log("existing", this.existingCustomerCodes);
  //       } else if (response && typeof response === 'object') {
  //         // Assuming the response is an object with sap_cust_codes property
  //         this.existingCustomerCodes = response;
  //         console.log("existing", this.existingCustomerCodes);
  //       } else {
  //         console.error('Error: Invalid response format');
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching existing customer codes:', error);
  //     }
  //   );
  // }
  // ////////////////////////////////

  // getExistingCustomerCodes(): void {
  //   this.customerservice.getExistingCustomerCodes().subscribe(
  //     (response) => {
  //       if (response && typeof response === 'object' && 'existing_codes' in response && Array.isArray(response.existing_codes)) {
  //         this.existingCustomerCodes = response.existing_codes.map(code => code.sap_cust_code);
  //         console.log("existing", this.existingCustomerCodes);
  //       } else {
  //         console.error('Error: Invalid response format');
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching existing customer codes:', error);
  //     }
  //   );
  // }

  getExistingCustomerCodes(): void {
    this.customerservice.getExistingCustomerCodes().subscribe(
      (response) => {
        if (response && typeof response === 'object' && 'existing_codes' in response && Array.isArray(response.existing_codes)) {
          this.existingCustomerCodes = response.existing_codes; // Assign the existing customer codes
          const sapCustCodes: string[] = this.existingCustomerCodes.map(code => code.sap_cust_code); // Map sap_cust_code from customer objects
          console.log("existing", sapCustCodes);
          
          if (!this.isEditMode) {
            this.generateSAPCustCode(sapCustCodes);
          } // Pass the array of SAP customer codes to generateSAPCustCode
        } else {
          console.error('Error: Invalid response format');
        }
      },
      (error) => {
        console.error('Error fetching existing customer codes:', error);
      }
    );
  }
  ///////////////////////////////////////////
  
  // generateSAPCustCode(): void {
  //   const custName = this.customerForm.get('CustName')?.value;
  //   let sapCustCode = 'C' + custName.substring(0, 3).toUpperCase() + '001';
  
  //   if (this.existingCustomerCodes.some(customer => customer.sap_cust_code === sapCustCode)) {
  //     let count = 2;
  //     while (this.existingCustomerCodes.some(customer => customer.sap_cust_code === sapCustCode)) {
  //       sapCustCode = 'C' + custName.substring(0, 3).toUpperCase() + count.toString().padStart(3, '0');
  //       count++;
  //     }
  //   }
  
  //   this.customerForm.get('sap_cust_code')?.setValue(sapCustCode);
  // }
  generateSAPCustCode(existingCustomerCodes: string[]): void {
    const custName = this.customerForm.get('CustName')?.value;
    const prefix = 'C' + custName.substring(0, 3).toUpperCase();
  
    let maxNumber = 0;
    let foundPrefix = false;
  
    // Iterate over existing customer codes to find the highest number
    for (const code of existingCustomerCodes) {
      // Check if the code starts with the prefix
      if (code.startsWith(prefix)) {
        foundPrefix = true;
        // Extract the number part
        const numberPart = parseInt(code.substring(prefix.length), 10);
        // Check if numberPart is a valid number
        if (!isNaN(numberPart)) {
          // Update maxNumber if numberPart is greater
          if (numberPart >= maxNumber) {
            maxNumber = numberPart + 1; // Increment maxNumber
          }
        }
      }
    }
  
    // If no existing code with the prefix was found, start with 1
    if (!foundPrefix) {
      maxNumber = 1; // Start with 1
    }
  
    // Generate the new SAP customer code
    const sapCustCode = prefix + maxNumber.toString().padStart(3, '0');
    console.log("Generated sapCustCode:", sapCustCode);
  
    this.customerForm.get('sap_cust_code')?.setValue(sapCustCode);
  }

  
  
  onInput(event: any) {
    event.target.value = event.target.value.toUpperCase();
}

  onSubmit(): void {
    console.log('Event Array:', this.eventArray); // Check the event array
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
  
      // Convert eventArray to comma-separated string
      customerData.Category = this.eventArray.join(',');
  
      const structuredData = {
        data: [customerData], // Assuming you're sending an array with a single object
      };
      // Your existing code for handling sap_create_date
      if (typeof customerData.sap_create_date === 'string') {
        customerData.sap_create_date = new Date(customerData.sap_create_date);
      }
  
      if (customerData.sap_create_date instanceof Date) {
        customerData.sap_create_date = this.datePipe.transform(customerData.sap_create_date, 'yyyy-MM-dd HH:mm:ss');
      }
      
      if (this.isEditMode && this.SapCustCode) {
        console.log('Customer Data (Edit Mode):', customerData); // Log customer data in edit mode
        console.log('Updated Date:', customerData.sap_create_date); // Log updated date
        this.customerservice.updateCustomer(this.SapCustCode, structuredData.data[0]).subscribe(
          (customers) => this.handleSuccess("Customer updated successfully", customers),
          (error) => this.handleError(error)
        );
      } else {
        // console.log('Customer Data:', customerData); // Log customer data in creation mode
        // this.customerservice.createCustomer(structuredData.data).subscribe(
        //   (customers) => this.handleSuccess("Customer created successfully", customers),
          
        //   (error) => this.handleError(error)
          
        // );
        console.log('Customer Data:', customerData); // Log customer data in creation mode
        this.customerservice.createCustomer(structuredData.data).subscribe(
          (customers) => {
            this.handleSuccess("Customer created successfully", customers);
            setTimeout(() => {
              this.router.navigate(['/md/customers/list']); // Redirect after 2 seconds
            }, 3000); // 2000 milliseconds delay
          },
          (error) => this.handleError(error)
        );
       // this.router.navigate(['/md/customers']);
      }
    }
  }

  
  fetchIndType() {
    this.customerservice.getindtype().subscribe(
      (response: any) => {
        console.log("Response:", response); // Log the response to see its structure
        if (Array.isArray(response)) {
          this.IndTypeOptions = response.map((item: string) => ({
            label: item,
            value: item,
          }));
        } else if (response && Array.isArray(response.name)) {
          this.IndTypeOptions = response.name.map(
            (item: string) => ({ label: item, value: item })
          );
        } else {
          console.error("Invalid response format:", response);
        }
      },
      (error) => {
        console.error("Error fetching vehicle types:", error);
      }
    );
  }

  
  fetchdeponame() {
    this.customerservice.getdepotname().subscribe(
      (response: any) => {
        console.log("Response:", response); // Log the response to see its structure
        if (Array.isArray(response)) {
          this.deponameOptions = response.map((item: string) => ({
            label: item,
            value: item,
          }));
        } else if (response && Array.isArray(response.BranchCode)) {
          this.deponameOptions = response.BranchCode.map(
            (item: string) => ({ label: item, value: item })
          );
        } else {
          console.error("Invalid response format:", response);
        }
      },
      (error) => {
        console.error("Error fetching vehicle types:", error);
      }
    );
  }

  
  // fetchgroupcode() {
  //   this.customerservice.getgroupcode().subscribe(
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


  
  
  
  
  // onSubmit(): void {
  //   console.log('Event Array:', this.eventArray); // Check the event array
  //   if (this.customerForm.valid) {
  //     const customerData = this.customerForm.value;
  
  //     // Convert eventArray to comma-separated string
  //     customerData.eventArray = this.eventArray.join(',');
  
  //     // Convert category back to array if it's present and not already an array
  //     if (customerData.category && typeof customerData.category === 'string') {
  //       customerData.category = customerData.category.split(',');
  //     }
  
  //     // Your existing code for handling sap_create_date
  //     if (typeof customerData.sap_create_date === 'string') {
  //       customerData.sap_create_date = new Date(customerData.sap_create_date);
  //     }
  
  //     if (customerData.sap_create_date instanceof Date) {
  //       customerData.sap_create_date = this.datePipe.transform(customerData.sap_create_date, 'yyyy-MM-dd HH:mm:ss');
  //     }
      
  //     if (this.isEditMode && this.SapCustCode) {
  //       console.log('Customer Data (Edit Mode):', customerData); // Log customer data in edit mode
  //       console.log('Updated Date:', customerData.sap_create_date); // Log updated date
  //       this.customerservice.updateCustomer(this.SapCustCode, customerData).subscribe(
  //         (customers) => this.handleSuccess("Customer updated successfully", customers),
  //         (error) => this.handleError(error)
  //       );
  //     } else {
  //       console.log('Customer Data:', customerData); // Log customer data in creation mode
  //       this.customerservice.createCustomer(customerData).subscribe(
  //         (customers) => this.handleSuccess("Customer created successfully", customers),
  //         (error) => this.handleError(error)
  //       );
  //     }
  //   }
  // }
  
  
  
// getSelectedCategories(): string {
//   const selectedCategories: string[] = [];
//   console.log();
//   for (const option of this.categoryOptions) {
//     if (this.customerForm.value.Category.includes(option.value)) {
//       selectedCategories.push(option.label);
//     }
//   }
//   console.log(selectedCategories); // Log selectedCategories array
//   return selectedCategories.join(', ');
// }



  private handleSuccess(message: string, response: any): void {
    this.createdOrEditedcustomer = response.customer;

    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.operationSuccessful = true;
    this.currentStep = 1; // Move to step 2 to show tenant details
  }

  private handleError(error: any): void {
    this.errorMessage = "An error occurred";
    this.messages = [
      { severity: "error", summary: "Error", detail: this.errorMessage },
    ];
    this.operationSuccessful = false;
    this.currentStep = 1; // Move to step 2 to show error message
    console.error("An error occurred:", error);
  }

  // Navigate back to the tenant list
  resetFormAndNavigateBack(): void {
    this.customerForm.reset();
    this.router.navigate(["/md/customers/list"]);
  }

  
  downloadExcelFormat() {
    // Define the column headers
    
      const headers = [
        'sap_cust_code',
        'sap_cust_grp_code',
        'CostCenter',
        'CustName',
        'Category',
        'MobileNo',
        'PAN',
        'GST_No',
        'City',
        'Pincode',
        'Location',
        'TelNo',
        'Address',
        'sap_ind_type',
        'CustNameMar',
        'AddressMar',
        'BillAddressMar',
        'BillingMail',
        'BillingMobileNo',
        'BiillingPerson',
        'Status',
        'sap_depot_name',
        'CreatedBy',
        'SalesReference',
        'sap_create_date',

      ];
    

    // Create a dummy data array representing Excel content
    const data: any[] = [
      headers, // Add headers as the first row
      [],
      // Replace "Value 1", "Value 2", etc., with your actual data
    ];

    // Convert data to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    // Create workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Save the workbook as Excel file
    XLSX.writeFile(wb, "customer_template.xlsx");
  }


  
  mapRowToContractData(row: any): customer {
    return {
      sap_cust_code: row.sap_cust_code,
      sap_cust_grp_code: row.sap_cust_grp_code,
      CostCenter: row.CostCenter,
      CustName: row.CustName,
      Category: row.Category,
      MobileNo: row.MobileNo,
      PAN: row.PAN,
      GST_No: row.GST_No,
      City: row.City,
      Pincode: row.Pincode,
      Location: row.Location,
      TelNo: row.TelNo,
      Address: row.Address,
      sap_ind_type: row.sap_ind_type,
      CustNameMar: row.CustNameMar,
      AddressMar: row.AddressMar,
      BillAddressMar: row.BillAddressMar,
      BillingMail: row.BillingMail,
      BillingMobileNo: row.BillingMobileNo,
      BiillingPerson: row.BiillingPerson,
      Status: row.Status,
      sap_depot_name: row.sap_depot_name,
      sap_create_date: row.sap_create_date,
      CreatedBy:row.CreatedBy,
      SalesReference:row.SalesReference,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
  


  uploadFile(fileInput: HTMLInputElement) {
    const fileList: FileList | null = fileInput.files;

    if (!fileList || fileList.length === 0) {
      console.error("Files not found.");
      return;
    }

    const file: File = fileList[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

      if (!jsonData || jsonData.length === 0) {
        console.error("No data found in the Excel file.");
        return;
      }

      console.log("Data from Excel:", jsonData);

      const customers: customer[] = [];

      if (Array.isArray(jsonData)) {
        jsonData.forEach((row: any) => {
          const contractData: customer = this.mapRowToContractData(row);
          customers.push(contractData);
        });
      }

      console.log("Data to send to server:", customers);
      this.customerservice.createCustomer
      (customers).subscribe(
        (response) => {
          console.log("Data successfully sent to the server:", response);
          // Show success alert using handleSuccess method
          this.handleSuccess("Customer Insert successfully", response);
          this.router.navigate([`/md/customers/list`]);
        },
        (error) => {
          console.error("Error while sending data to the server:", error);
          // Check if the error response contains the duplicate city name
          if (error.error && error.error.message) {
            const errorMessage = error.error.message;
            const match = errorMessage.match(/duplicate entry '(.+)' for key/);
            if (match && match.length > 1) {
              const duplicateCityName = match[1];
              alert(`City with name ${duplicateCityName} already exists.`);
            } else {
              // Handle other errors if needed
              console.error("Error:", error);
            }
          } else {
            // Handle other errors if needed
            console.error("Error:", error);
          }
        }
      );
    };

    reader.readAsArrayBuffer(file);
  }

  

}
