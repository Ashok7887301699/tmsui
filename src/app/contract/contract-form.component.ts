import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators,FormControl } from "@angular/forms";
import { MessageService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { ContractService } from "./services/contract.service";
import { UserContextService } from "../core/services/user-context.service";
import { UserContext } from "../core/models/user-context.model";
import { DatePipe } from '@angular/common';


@Component({
  selector: "app-tenant-form",
  templateUrl: "./contract-form.component.html",
})
export class ContractFormComponent implements OnInit {
  minStartDate: Date = new Date(); // Define minStartDate property with default value
  suggestions: any[] = [];
  ContractForm: FormGroup;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  isEditMode: boolean = false;
  selectedContractId: number | null = null;
  createdOrEditedContract: any; // Corrected variable name
  userContext: UserContext | null = null; // Define the type of userContext
  statusOptions = [
    { label: "NONE", value: null },
    { label: "REGISTERED", value: "REGISTERED" },
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  constructor(
     private datePipe: DatePipe,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private contractService: ContractService,
    private userContextService: UserContextService, // Corrected service name
    private route: ActivatedRoute,
  ) {
    this.ContractForm = this.fb.group({
      sap_cust_code: ["", Validators.required],
      start_date: ["", Validators.required],
      end_date: ["", Validators.required],
      Category: ["", Validators.required],
    });

    this.steps = [{ label: "Contract Form" }, { label: "Service Selection" },{ label: "Excess Weight" },{ label: "Door Delivery" },{ label: "Slab Definitions" },{ label: "Slab Rate" }];
  }

  search(event: any) {
    this.contractService.searchCustomers(event.query).subscribe((response: any[]) => {
      this.suggestions = response.map(item => ({ label: `${item.sap_cust_code}: ${item.CustName}`, value: item.sap_cust_code }));
    });
  }
  onSuggestionSelect(event: any) {
    const selectedSapCustCode = event.value.value; // Extracting the value property
    console.log("Selected SAP Cust Code:", selectedSapCustCode);
    // Fetch data based on the selected SAP Cust Code
    this.fetchData(selectedSapCustCode);
  }
  
  fetchData(selectedSapCustCode: string) {
    this.contractService.fetchDataBySapCustCode(selectedSapCustCode).subscribe(
      (data: any[]) => {
        if (data && data.length > 0) {
          const category = data[0].Category;
          this.ContractForm.get('Category')!.setValue(category);
        } else {
          console.error('No data returned from the service.');
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  
  
  
  
  ngOnInit(): void {

    this.initForm();
    this.setMinStartDate();
    this.userContext = this.userContextService.getUserContext();
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.selectedContractId = params["id"];
        if (this.selectedContractId !== null) {
          this.loadcontractData(this.selectedContractId);
        }
      }
    });
  }

  initForm(): void {
    this.ContractForm = this.fb.group({
      sap_cust_code: [''],
      Category: [''],
      start_date: [''],
      end_date: [''],
      status: ['']
    });
  }

  setMinStartDate(): void {
    this.minStartDate.setHours(0, 0, 0, 0); 
  }


  onServiceSelectionSuccess() {
    // Handle the successful service selection here
    this.currentStep = 2; // Move to step 2 after successful service selection
  }
  onserviceexcessSuccess()
  {
    this.currentStep = 3;
  }
  onservicedoordelivery()
  {
    this.currentStep = 4;
  }
  onslabdefinationsucess()
  {
    this.currentStep = 5;
  }
  onslabratesucess()
  {
    this.currentStep = 6;
  }
  cancel() {
    this.router.navigate(["/md/contract"]);
  }

  private loadcontractData(contract_id: number): void {
    this.contractService.getContractById(contract_id).subscribe(
      (contract) => this.ContractForm.patchValue(contract),
      (error) => this.handleError(error)
    );
  }

  onSubmit(): void {
    if (this.ContractForm.valid) {
      const status = 'ACTIVE'; // Set status to 'ACTIVE'
      let contractData = this.ContractForm.value;
  
      // Extract only the value of the customer_id field
      if (contractData.sap_cust_code && typeof contractData.sap_cust_code === 'object') {
        contractData.sap_cust_code = contractData.sap_cust_code.value;
      }
  
      // Check if userContext and tenantId are available
      if (this.userContext && this.userContext.tenantId && this.userContext.loginId ) {
        // Convert tenantId to string if necessary
        contractData.tenant_id = String(this.userContext.tenantId);
        contractData.created_by = this.userContext.loginId; 
      } else {
        // Handle case where tenantId is not available
        console.error('Tenant ID is missing. Please select a tenant.');
        return;
      }
  

      // Add status to the contract data
      contractData = { ...contractData, status };
  
      if (this.isEditMode && this.selectedContractId) {
        this.contractService.updateContract(this.selectedContractId, contractData).subscribe(
          (contract) => this.handleSuccess("Contract updated successfully", contract),
          (error) => this.handleError(error)
        );
      } else {
        this.contractService.createContract(contractData).subscribe(
          (contract) => this.handleSuccess("Contract created successfully", contract),
          (error) => this.handleError(error)
        );
      }
    } else {
      this.currentStep = 0; // Move to step 1 if the form is not valid
    }
  }
  

  resetFormAndNavigateBack(): void {
    // Reset form and navigate back to contract list or previous page
  }

  private handleSuccess(message: string, contract: any) {
    this.messageService.add({ severity: "success", summary: "Success", detail: message });
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedContract = contract; // Assuming you have contract data available
    this.operationSuccessful = true;
    this.currentStep = 1; // Move to step 2 to show contract details
  }

  private handleError(error: any) {
    let errorMessage = 'An error occurred. Please try again.'; // Default error message
    if (typeof error === 'string') {
      // If the error is a string (custom error message)
      errorMessage = error;
    } else if (error && error.error && error.error.message) {
      // If the error object contains a message property
      errorMessage = error.error.message;
    }
  
    this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
    this.messages = [{ severity: 'error', summary: 'Error', detail: errorMessage }];
    this.operationSuccessful = false;
    this.currentStep = 0; // Move back to step 1 to show the form
    console.error('An error occurred:', error);
  }
  


}
