import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PackagetypeService } from "./services/packagetype.service";
import { MessageService } from "primeng/api";
import { PackageType } from "./models/packagetype.model";

@Component({
  selector: "app-packagetype-form",
  templateUrl: "./packagetype-form.component.html",
})
export class PackagetypeFormComponent implements OnInit {
  packagetypeForm: FormGroup;
  isEditMode: boolean = false;
  packagetypeId: number | null = null;
  steps: any[] = []; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedPackageType: PackageType | null = null; // Store the tenant data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private packagetypeService: PackagetypeService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.packagetypeForm = this.fb.group({
      package_type: ["", Validators.required],
      status: ["", Validators.required],
    });

    this.steps = [
      { label: "PackageType Form" },
      { label: "PackageType Details" },
    ];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.packagetypeId = params["id"];
        if (this.packagetypeId !== null) {
          this.loadPackagetypeData(this.packagetypeId);
        }
      }
    });
  }

  statusOptions = [
    // { label: "NONE", value: null }, // Allows deselection by setting the value to null
    { label: "ACTIVE", value: "ACTIVE" },
    // { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  private loadPackagetypeData(id: number): void {
    this.packagetypeService.getPackageTypeById(id).subscribe(
      (packagetype: PackageType) =>
        this.packagetypeForm.patchValue(packagetype),
      (error) => this.handleError(error)
    );
  }

  onSubmit(): void {
    if (this.packagetypeForm.valid) {
      const packagetypeData = this.packagetypeForm.value;
      if (this.isEditMode && this.packagetypeId) {
        this.packagetypeService.updatePackageType(this.packagetypeId, packagetypeData).subscribe(
          (packagetype) => this.handleSuccess("PackageType updated successfully", packagetype),
          (error) => {
            if (error.status === 422 && error.error.errors) {
              const errorMessage = this.extractErrorMessage(error.error.errors);
              this.showError(errorMessage);
            } else {
              this.handleError(error);
            }
          }
        );
      } else {
        this.packagetypeService.createPackageType(packagetypeData).subscribe(
          (packagetype) => this.handleSuccess("PackageType created successfully", packagetype),
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
    packagetype: PackageType | null
  ): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedPackageType = packagetype;
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
    this.router.navigate(["/md/packagetype"]);
    this.packagetypeForm.reset(); // Reset the form when canceling the operation
  }

  resetFormAndNavigateBack(): void {
    this.packagetypeForm.reset();
    this.router.navigate(["/md/packagetype"]);
  }
}
