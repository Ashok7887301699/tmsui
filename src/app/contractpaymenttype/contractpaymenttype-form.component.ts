import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ContractPaymentTypeService } from "./services/contractpaymenttype.service";
import { MessageService } from "primeng/api";
import { ContractPaymentType } from "./models/contractpaymenttype.model";

@Component({
  selector: "app-contractpaymenttype-form",
  templateUrl: "./contractpaymenttype-form.component.html",
})
export class ContractPaymentTypeFormComponent implements OnInit {
  paymenttypeForm: FormGroup;
  isEditMode: boolean = false;
  ContractPaymentTypeId: number | null = null;
  steps: any[] = []; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedContractPaymentType: ContractPaymentType | null = null; // Store the tenant data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private contractpaymenttypeService: ContractPaymentTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.paymenttypeForm = this.fb.group({
      contract_paymenttype: ["", Validators.required],
      status: ["", Validators.required],
    });

    this.steps = [
      { label: "PaymentType Form" },
      { label: "PaymentType Details" },
    ];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.ContractPaymentTypeId = params["id"];
        if (this.ContractPaymentTypeId !== null) {
          this.loadPaymenttypeData(this.ContractPaymentTypeId);
        }
      }
    });
  }

  statusOptions = [
    // { label: "NONE", value: null }, // Allows deselection by setting the value to null
    { label: "ACTIVE", value: "ACTIVE" },
    // { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  private loadPaymenttypeData(id: number): void {
    this.contractpaymenttypeService.getContractPaymentTypeById(id).subscribe(
      (paymenttype: ContractPaymentType) =>
        this.paymenttypeForm.patchValue(paymenttype),
      (error) => this.handleError(error)
    );
  }

  onSubmit(): void {
    if (this.paymenttypeForm.valid) {
      const paymenttypeData = this.paymenttypeForm.value;
      if (this.isEditMode && this.ContractPaymentTypeId) {
        this.contractpaymenttypeService.updateContractPaymentType(this.ContractPaymentTypeId, paymenttypeData).subscribe(
          (paymenttype) => this.handleSuccess("PaymentType updated successfully", paymenttype),
          (error) =>{
            if (error.status === 422 && error.error.errors) {
              const errorMessage = this.extractErrorMessage(error.error.errors);
              this.showError(errorMessage);
            } else {
              this.handleError(error);
            }
          }
        );
      } else {
        this.contractpaymenttypeService.createContractPaymentType(paymenttypeData).subscribe(
          (paymenttype) => this.handleSuccess("PaymentType created successfully", paymenttype),
          (error) => {
            if (error.status === 422 && error.error.errors) {
              const errorMessage = this.extractErrorMessage(error.error.errors);
              this.showError(errorMessage);
            } else {
              this.handleError(error);
            }
          }
        );
      }
    }
  }



  extractErrorMessage(errors: any): string {
    let errorMessage = '';
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        errorMessage += `${errors[key][0]}\n`;
      }
    }
    return errorMessage;
  }

  
  showSuccess(message: string) {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: message,
    });
  }

  showError(message: string) {
    this.messageService.add({
      severity: "warn",
      summary: "Warning",
      detail: message,
    });
  }
  
  

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private handleSuccess(
    message: string,
    paymenttype: ContractPaymentType | null
  ): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedContractPaymentType = paymenttype;
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

  cancel(): void {
    this.router.navigate(["/md/paymenttype"]);
    this.paymenttypeForm.reset(); // Reset the form when canceling the operation
  }

  resetFormAndNavigateBack(): void {
    this.paymenttypeForm.reset();
    this.router.navigate(["/md/paymenttype"]);
  }
}
