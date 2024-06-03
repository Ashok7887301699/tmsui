import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { IndiaService } from "./services/india.service";
import { MessageService } from "primeng/api";
import { India } from "./models/india.model";

@Component({
  selector: "app-india-form",
  templateUrl: "./india-form.component.html",
})
export class IndiaFormComponent implements OnInit {
  cancel() {
    this.router.navigate(["/md/india"]);
  }
  indiaForm: FormGroup;
  isEditMode: boolean = false;
  indiaId: number | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedIndia: India | null = null; // Store the india data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private indiaService: IndiaService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.indiaForm = this.fb.group({
      // Define the form controls and validation rules
     // name: ["", Validators.required],
      Country: ["", Validators.required],
      state: ["", Validators.required],
      district: ["", Validators.required],
      taluka: ["", Validators.required],
      postoffice: ["", Validators.required],
      post_pincode: ["", Validators.required],
      
      status: ["", Validators.required],
    });

    // Initialize the steps
    this.steps = [{ label: "India Form" }, { label: "India Details" }];
  }

  ngOnInit(): void {
    // Subscribe to route parameters to determine if in edit mode
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.indiaId = params["id"];
        if (this.indiaId !== null) {
          this.loadIndiaData(this.indiaId);
        }
      }
    });
  }

  // Dropdown options for india status
  statusOptions = [
    // { label: "NONE", value: null },
    // { label: "REGISTERED", value: "REGISTERED" },
    { label: "ACTIVE", value: "ACTIVE" },
    // { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  // Load india data for editing
  private loadIndiaData(id: number): void {
    this.indiaService.getIndiaById(id).subscribe(
      (india) => this.indiaForm.patchValue(india),
      (error) => this.handleError(error)
    );
  }

  // Handle form submission
  onSubmit(): void {
    if (this.indiaForm.valid) {
      const indiaData = this.indiaForm.value;
      if (this.isEditMode && this.indiaId) {
        this.indiaService.updateIndia(this.indiaId, indiaData).subscribe(
          (india) => this.handleSuccess("India updated successfully", india),
          (error) => this.handleError(error)
        );
      } else {
        this.indiaService.createIndia(indiaData).subscribe(
          (india) => this.handleSuccess("India created successfully", india),
          (error) => this.handleError(error)
        );
      }
    }
  }

  private handleSuccess(message: string, india: India | null): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedIndia = india;
    this.operationSuccessful = true;
    this.currentStep = 1; // Move to step 2 to show india details
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

  // Navigate back to the india list
  resetFormAndNavigateBack(): void {
    this.indiaForm.reset();
    this.router.navigate(["/md/india"]);
  }
}
