import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { VehiclecapacitymodelService } from "./services/vehiclecapacitymodel.service";
import { VehicleCapacityModel } from "./models/vehiclecapacitymodel.model";

@Component({
  selector: "app-vehiclecapacitymodel-form",
  templateUrl: "./vehiclecapacitymodel-form.component.html",
})
export class VehiclecapacitymodelFormComponent implements OnInit {
  cancel() {
    this.router.navigate(["/md/vehiclecapacitymodel"]);
  }
  vehiclecapacitymodelForm: FormGroup;
  isEditMode: boolean = false;
  vehiclecapacitymodelId: number | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedVehicleCapacityModel: VehicleCapacityModel | null = null; // Store the Product type data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private vehiclecapacitymodelService: VehiclecapacitymodelService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.vehiclecapacitymodelForm = this.fb.group({
      vehcpctmodel: ["", Validators.required],
      vehiclecpct: ["", Validators.required],
      modeldesc: ["", Validators.required],
      status: ["", Validators.required],
    });
    // Initialize the steps
    this.steps = [
      { label: "Vehicle Capacity Model Form" },
      { label: "Vehicle Capacity Model Details" },
    ];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.vehiclecapacitymodelId = params["id"];
        if (this.vehiclecapacitymodelId !== null) {
          this.loadVehicleCapacityModelData(this.vehiclecapacitymodelId);
        }
      }
    });
  }
  // Dropdown options
  statusOptions = [
    // { label: "NONE", value: null }, // Allows deselection by setting the value to null
    { label: "ACTIVE", value: "ACTIVE" },
    // { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  private loadVehicleCapacityModelData(id: number): void {
    this.vehiclecapacitymodelService.getVehicleCapacityModelById(id).subscribe(
      (vehiclecapacitymodel: VehicleCapacityModel) =>
        this.vehiclecapacitymodelForm.patchValue(vehiclecapacitymodel),
      (error) => this.handleError(error)
    );
  }

  onSubmit(): void {
    if (this.vehiclecapacitymodelForm.valid) {
      const vehiclecapacitymodelData = this.vehiclecapacitymodelForm.value;
      if (this.isEditMode && this.vehiclecapacitymodelId) {
        this.vehiclecapacitymodelService.updateVehicleCapacityModel(this.vehiclecapacitymodelId, vehiclecapacitymodelData).subscribe(
          (vehiclecapacitymodel) => this.handleSuccess("Vehicle Capacity Model updated successfully", vehiclecapacitymodel),
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
        this.vehiclecapacitymodelService.createVehicleCapacityModel(vehiclecapacitymodelData).subscribe(
          (vehiclecapacitymodel) => this.handleSuccess("Group Master created successfully", vehiclecapacitymodel),
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

  private handleSuccess(
    message: string,
    vehiclecapacitymodel: VehicleCapacityModel
  ): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedVehicleCapacityModel = vehiclecapacitymodel;
    this.operationSuccessful = true;
    this.currentStep = 1; // Move to step 2 to show vehiclecapacitymodel details
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
  // Navigate back to the producttype list
  resetFormAndNavigateBack(): void {
    this.vehiclecapacitymodelForm.reset();
    this.router.navigate(["/md/vehiclecapacitymodel"]);
  }
}
