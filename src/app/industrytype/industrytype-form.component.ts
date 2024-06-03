import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { IndustrytypeService } from "./services/industrytype.service";
import { IndustryType } from "./models/industrytype.model";

@Component({
  selector: 'app-industrytype-form',
  templateUrl: "./industrytype-form.component.html",
})
export class IndustrytypeFormComponent implements OnInit {
  cancel() {
    this.router.navigate(["/md/industrytype"]);
  }
  industrytypeForm: FormGroup;
  isEditMode: boolean = false;
  industrytypeId: number | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedIndustrytype: IndustryType | null = null; // Store the Product type data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private industrytypeService: IndustrytypeService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.industrytypeForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      status: ["", Validators.required],
    });
    // Initialize the steps
    this.steps = [{ label: "Industrytype Form" }, { label: "Industrytype Details" }];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.industrytypeId = params["id"];
        if (this.industrytypeId !== null) {
          this.loadIndustrytypeData(this.industrytypeId);
        }
      }
    });
  }
  // Dropdown options
  statusOptions = [
    // { label: "NONE", value: null }, // Allows deselection by setting the value to null
    { label: "ACTIVE", value: "ACTIVE" },
    // { label: "DEACTIVATED", value: "DEACTIVATED" },
    // { label: "BLOCKED", value: "BLOCKED" },
  ];

  private loadIndustrytypeData(id: number): void {
    this.industrytypeService.getIndustrytypeById(id).subscribe(
      (industrytype: IndustryType) => this.industrytypeForm.patchValue(industrytype),
      (error) => this.handleError(error)
    );
  }

  onSubmit(): void {
    if (this.industrytypeForm.valid) {
      const packagetypeData = this.industrytypeForm.value;

      if (this.isEditMode && this.industrytypeId) {
        this.industrytypeService.updateIndustrytype(this.industrytypeId, packagetypeData).subscribe(
          (industrytype) => this.handleSuccess("IndustryType updated successfully", industrytype),
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
        this.industrytypeService.createIndustrytype(packagetypeData).subscribe(
          (industrytype) => this.handleSuccess("IndustryType created successfully", industrytype),
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


  private handleSuccess(message: string, industrytype: IndustryType): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedIndustrytype = industrytype;
    this.operationSuccessful = true;
    this.currentStep = 1; // Move to step 2 to show industrytype details
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
  // Navigate back to the industrytype list
  resetFormAndNavigateBack(): void {
    this.industrytypeForm.reset();
    this.router.navigate(["/md/industrytype"]);
  }

}
