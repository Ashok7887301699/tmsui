import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { vendorfuelService } from "./services/vendorfuel.service";
import { MessageService } from "primeng/api";
import { VendorFuel } from "./models/vendorfuel.model";

@Component({
  selector: "app-vendorfuel-form",
  templateUrl: "./vendorfuel-form.component.html",
})
export class VendorfuelFormComponent implements OnInit {
  vendorfuelForm: FormGroup;
  isEditMode: boolean = false;
  vendorfuelId: number | null = null;
  steps: any[] = []; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedVendorFuel: VendorFuel | null = null; // Store the tenant data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private vendorfuelService: vendorfuelService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.vendorfuelForm = this.fb.group({
      PetrolPumpName: ["", Validators.required],
      Vendorname: ["", Validators.required],
      DVendorCode: ["", Validators.required],
      Depot: ["", Validators.required],
      status: ["", Validators.required],
    });

    this.steps = [
      { label: "VendorFuel Form" },
      { label: "VendorFuel Details" },
    ];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.vendorfuelId = params["id"];
        if (this.vendorfuelId !== null) {
          this.loadVendorfuelData(this.vendorfuelId);
        }
      }
    });
  }

  statusOptions = [
    // { label: "NONE", value: null }, // Allows deselection by setting the value to null
    { label: "ACTIVE", value: "ACTIVE" },
    // { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  private loadVendorfuelData(id: number): void {
    this.vendorfuelService.getVendorFuelById(id).subscribe(
      (vendorfuel: VendorFuel) => this.vendorfuelForm.patchValue(vendorfuel),
      (error) => this.handleError(error)
    );
  }

  onSubmit(): void {
    if (this.vendorfuelForm.valid) {
      const vendorfuelData = this.vendorfuelForm.value;
      if (this.isEditMode && this.vendorfuelId) {
        this.vendorfuelService.updateVendorFuel(this.vendorfuelId, vendorfuelData).subscribe(
          (vendorfuel) => this.handleSuccess("VendorFuel updated successfully", vendorfuel),
          (error) => {
            if (error.status === 422 && error.error.errors) {
              // Handle validation errors
              const errorMessage = this.extractErrorMessage(error.error.errors);
              // Display error message using showError method
              this.showError(errorMessage);
            } else {
              // Handle other errors
              this.handleError(error);
            }
          }
        );
      } else {
        this.vendorfuelService.createVendorFuel(vendorfuelData).subscribe(
          (vendorfuel) => this.handleSuccess("VendorFuel created successfully", vendorfuel),
          (error) => {
            if (error.status === 422 && error.error.errors) {
              // Handle validation errors
              const errorMessage = this.extractErrorMessage(error.error.errors);
              // Display error message using showError method
              this.showError(errorMessage);
            } else {
              // Handle other errors
              this.handleError(error);
            }
          }
        );
      }
    }
  }
  
  // Helper function to extract error message from validation errors
  extractErrorMessage(errors: any): string {
    let errorMessage = '';
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        errorMessage += `${errors[key][0]}\n`;
      }
    }
    return errorMessage;
  }
  
  // Assuming showMessageServiceError is available in the component
  showError(message: string) {
    this.messageService.add({
      severity: "warn",
      summary: "Warning",
      detail: message,
    });
  }
  
  // Assuming showMessageServiceSuccess is available in the component
  showSuccess(message: string) {
    this.messageService.add({
      severity: "success",
      summary: "Success",
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

  private handleSuccess(message: string, vendorfuel: VendorFuel | null): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedVendorFuel = vendorfuel;
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
    this.router.navigate(["/md/vendorfuel"]);
    this.vendorfuelForm.reset(); // Reset the form when canceling the operation
  }

  resetFormAndNavigateBack(): void {
    this.vendorfuelForm.reset();
    this.router.navigate(["/md/vendorfuel"]);
  }
}
