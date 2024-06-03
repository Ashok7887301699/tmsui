import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { GroupMasterService } from "./services/groupmaster.service";
import { GroupMaster } from "./models/groupmaster.model";

@Component({
  selector: 'app-groupmaster-form',
  templateUrl: "./groupmaster-form.component.html",
})
export class GroupmasterFormComponent implements OnInit {
  cancel() {
    this.router.navigate(["/md/groupmaster"]);
  }
  groupmasterForm: FormGroup;
  isEditMode: boolean = false;
  groupmasterId: number | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedGroupMaster: GroupMaster | null = null; // Store the Product type data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private groupmasterService: GroupMasterService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.groupmasterForm = this.fb.group({
      groupcode: ["", Validators.required],
      groupname: ["", Validators.required],
      status: ["", Validators.required],
    });
    // Initialize the steps
    this.steps = [
      { label: "Group Master Form" },
      { label: "Group Master Details" },
    ];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.groupmasterId = params["id"];
        if (this.groupmasterId !== null) {
          this.loadGroupMasterData(this.groupmasterId);
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

  private loadGroupMasterData(id: number): void {
    this.groupmasterService.getGroupMasterById(id).subscribe(
      (groupmaster: GroupMaster) =>
        this.groupmasterForm.patchValue(groupmaster),
      (error) => this.handleError(error)
    );
  }

  onSubmit(): void {
    if (this.groupmasterForm.valid) {
      const groupmasterData = this.groupmasterForm.value;
      if (this.isEditMode && this.groupmasterId) {
        this.groupmasterService.updateGroupMaster(this.groupmasterId, groupmasterData).subscribe(
          (groupmaster) => this.handleSuccess("Group Master updated successfully", groupmaster),
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
        this.groupmasterService.createGroupMaster(groupmasterData).subscribe(
          (groupmaster) => this.handleSuccess("Group Master created successfully", groupmaster),
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
    groupmaster: GroupMaster
  ): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedGroupMaster = groupmaster;
    this.operationSuccessful = true;
    this.currentStep = 1; // Move to step 2 to show groupmaster details
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
    this.groupmasterForm.reset();
    this.router.navigate(["/md/groupmaster"]);
  }

}
