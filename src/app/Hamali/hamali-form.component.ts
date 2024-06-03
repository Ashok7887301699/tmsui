import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HamaliService } from "./services/hamali.service";
import { MessageService } from "primeng/api";
import { Hamali } from "./models/hamali.model";

@Component({
  selector: "app-hamali-form",
  templateUrl: "./hamali-form.component.html",
})
export class HamaliFormComponent implements OnInit {
  hamaliForm: FormGroup;
  isEditMode: boolean = false;
  hamaliId: number | null = null;
  steps: any[] = []; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedHamali: Hamali | null = null; // Store the tenant data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private hamaliService: HamaliService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.hamaliForm = this.fb.group({
      VendorCode: ["", Validators.required],
      Hvendor: ["", Validators.required],
      HIFSC: ["", Validators.required],
      U_Location: ["", Validators.required],
      DEPOT: ["", Validators.required],
      HAccountNO: ["", Validators.required],
      Hbank: ["", Validators.required],
      Category: ["", Validators.required],
      Hbranch: ["", Validators.required],
      status: ["", Validators.required],
    });

    this.steps = [{ label: "Hamali Form" }, { label: "Hamali Details" }];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.hamaliId = params["id"];
        if (this.hamaliId !== null) {
          this.loadHamaliData(this.hamaliId);
        }
      }
    });
  }

  statusOptions = [
    // { label: "NONE", value: null }, // Allows deselection by setting the value to null
    { label: "ACTIVE", value: "ACTIVE" },
    // { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  private loadHamaliData(id: number): void {
    this.hamaliService.getHamaliById(id).subscribe(
      (hamali: Hamali) => this.hamaliForm.patchValue(hamali),
      (error) => this.handleError(error)
    );
  }

  onSubmit(): void {
    if (this.hamaliForm.valid) {
      const hamaliData = this.hamaliForm.value;
      if (this.isEditMode && this.hamaliId) {
        this.hamaliService.updateHamali(this.hamaliId, hamaliData).subscribe(
          (hamali) => this.handleSuccess("Hamali updated successfully", hamali),
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
        this.hamaliService.createHamali(hamaliData).subscribe(
          (hamali) => this.handleSuccess("Hamali created successfully", hamali),
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

  private handleSuccess(message: string, hamali: Hamali | null): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedHamali = hamali;
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
    this.router.navigate(["/md/hamali"]);
    this.hamaliForm.reset(); // Reset the form when canceling the operation
  }

  resetFormAndNavigateBack(): void {
    this.hamaliForm.reset();
    this.router.navigate(["/md/hamali"]);
  }
}
