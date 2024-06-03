import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { VendorService } from "./services/vendor.service";
import { MessageService } from "primeng/api";
import { Vendor } from "./models/vendor.model";

@Component({
  selector: "app-vendor-form",
  templateUrl: "./vendor-form.component.html",
})
export class VendorFormComponent implements OnInit {
  vendorForm: FormGroup;
  isEditMode: boolean = false;
  vendorId: number | null = null;
  steps: any[] = []; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedVendor: Vendor | null = null; // Store the tenant data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.vendorForm = this.fb.group({
      VendorCode: ["", Validators.required],
      VendorName: ["", Validators.required],
      Type: ["", Validators.required],
      Address: ["", Validators.required],
      City: ["", Validators.required],
      Depot: ["", Validators.required],
      Vehicle: ["", Validators.required],
      Pincode: ["", Validators.required],
      Mobile_No: ["", Validators.required],
      Email: ["", Validators.required],
      PAN_No: ["", Validators.required],
      GSTNO: ["", Validators.required],
      BankName: ["", Validators.required],
      AccountNO: ["", Validators.required],
      IFSC: ["", Validators.required],
      Category: ["", Validators.required],
      U_Location: ["", Validators.required],
      status: ["", Validators.required],
    });

    this.steps = [{ label: "Vendor Form" }, { label: "Vendor Details" }];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.vendorId = params["id"];
        if (this.vendorId !== null) {
          this.loadVendorData(this.vendorId);
        }
      }
    });
  }

  statusOptions = [
    // { label: "NONE", value: null }, // Allows deselection by setting the value to null
    { label: "ACTIVE", value: "ACTIVE" },
    // { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  private loadVendorData(id: number): void {
    this.vendorService.getVendorById(id).subscribe(
      (vendor: Vendor) => this.vendorForm.patchValue(vendor),
      (error) => this.handleError(error)
    );
  }

  onSubmit(): void {
    if (this.vendorForm.valid) {
      const vendorData = this.vendorForm.value;
    
      if (this.isEditMode && this.vendorId) {
        this.vendorService.updateVendor(this.vendorId, vendorData).subscribe(
          (vendor) => this.handleSuccess("vendor updated successfully", vendor),
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
        this.vendorService.createVendor(vendorData).subscribe(
          (vendor) => this.handleSuccess("Vendor created successfully", vendor),
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

  private handleSuccess(message: string, vendor: Vendor | null): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedVendor = vendor;
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
    this.router.navigate(["/md/vendor"]);
    this.vendorForm.reset(); // Reset the form when canceling the operation
  }

  resetFormAndNavigateBack(): void {
    this.vendorForm.reset();
    this.router.navigate(["/md/vendor"]);
  }
}
