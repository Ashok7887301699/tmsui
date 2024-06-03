import { Tyreinventory } from './models/tyreinventory.model';
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { TyreinventoryService } from './services/tyreinventory.service';
import { TyreinventoryStateService } from './services/tyreinventory-state.service';


@Component({
  selector: 'app-tyreinventory-form',
  templateUrl:'./tyreinventory-form.component.html',
  styles: ``
})
export class TyreinventoryFormComponent {
 
 TyreinventoryForm: FormGroup;
  isEditMode: boolean = false;
  tyreinventoryId: number | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedTyreinventory: Tyreinventory | null = null; // Store the tyreinventory data after successful operation
  errorMessage: string = ""; // Store error message
  constructor(
    private fb: FormBuilder,
    private  TyreinventoryService:TyreinventoryService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  )
  {this.TyreinventoryForm = this.fb.group({
    // Define the form controls and validation rules
    tyre_number: ["", Validators.required],
    tyre_category: ["", Validators.required],
    manufacturer: ["", Validators.required],
    tyre_size: ["", Validators.required],
    tyre_pattern: ["", Validators.required],
    purchase_date: ["", Validators.required],
    qty: ["", Validators.required],
    price: ["", Validators.required],
    tyre_type: ["", Validators.required],
    tyre_position: ["", Validators.required],
    tyre_weight: ["", Validators.required],
    tyre_status: ["", Validators.required],
    status: ["", Validators.required],
  });

  // Initialize the steps
  this.steps = [{ label: "Tyre Inventory Form" }, { label: "Tyre Inventory Details" }];
}

ngOnInit(): void {
  // Subscribe to route parameters to determine if in edit mode
  this.route.params.subscribe((params) => {
    if (params["id"]) {
      this.isEditMode = true;
      this.tyreinventoryId = params["id"];
      if (this.tyreinventoryId !== null) {
        this.loadTyreinventoryData(this.tyreinventoryId);
      }
    }
  });
}

statusOptions = [
  { label: "ACTIVE", value: "ACTIVE" },
];
 // Dropdown options
 TyreStatusOptions = [
    
  { label: "Brand New", value: "Brand New" },
  { label: "In Use", value: "In Use" },
  { label: "Scrap", value: "Scrap" },
];
private loadTyreinventoryData(id: number): void {
  this.TyreinventoryService.gettyreinventoryById(id).subscribe(
    (Tyreinventory) => this.TyreinventoryForm.patchValue(Tyreinventory),
    (error) => this.handleError(error)
  );
}
// Handle form submission
onSubmit(): void {
  if (this.TyreinventoryForm.valid) {
    const tyreinventoryDta = this.TyreinventoryForm.value;
    if (this.isEditMode && this.tyreinventoryId) {
      this.TyreinventoryService.updatetyreinventory(this.tyreinventoryId, tyreinventoryDta).subscribe(
        (Tyreinventory) => this.handleSuccess("Tyre updated successfully", Tyreinventory),
        (error) => this.handleError(error)
      );
    } else {
      this.TyreinventoryService.createtyreinventory(tyreinventoryDta).subscribe(
        (Tyreinventory) => this.handleSuccess("Tyre created successfully", Tyreinventory),
        (error) => this.handleError(error)
      );
    }
  }
}
private handleSuccess(message: string, Tyreinventory: Tyreinventory | null): void {
  this.messages = [
    { severity: "success", summary: "Success", detail: message },
  ];
  this.createdOrEditedTyreinventory = Tyreinventory;
  this.operationSuccessful = true;
  this.currentStep = 1; // Move to step 2 to show Tyreinventory details
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
  this.router.navigate(["/md/tyreinventory"]);
  this.TyreinventoryForm.reset(); // Reset the form when canceling the operation
}
// Navigate back to the tyreinventory list
resetFormAndNavigateBack(): void {
  this.TyreinventoryForm.reset();
  this.router.navigate(["/md/tyreinventory"]);
}
}