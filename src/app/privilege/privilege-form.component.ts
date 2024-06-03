import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { PrivilegeService } from "./services/privilege.service";
import { Privilege } from "./models/privilege.model";

@Component({
  selector: "app-privilege-form",
  templateUrl: "./privilege-form.component.html",
})
export class PrivilegeFormComponent implements OnInit {
  cancel() {
    this.router.navigate(["/um/privilege"]);
  }
  privilegeForm: FormGroup;
  isEditMode: boolean = false;
  privilegeId: number | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedPrivilege: Privilege | null = null; // Store the Privilege type data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private privilegeService: PrivilegeService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.privilegeForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      status: ["", Validators.required],
    });
    // Initialize the steps
    this.steps = [{ label: "Privilege Form" }, { label: "Privilege Details" }];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.privilegeId = params["id"];
        if (this.privilegeId !== null) {
          this.loadPrivilegeData(this.privilegeId);
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

  private loadPrivilegeData(id: number): void {
    this.privilegeService.getPrivilegeById(id).subscribe(
      (privilege: Privilege) => this.privilegeForm.patchValue(privilege),
      (error) => this.handleError(error)
    );
  }

  onSubmit(): void {
    if (this.privilegeForm.valid) {
      const privilegeData = this.privilegeForm.value;

      if (this.isEditMode && this.privilegeId) {
        this.privilegeService
          .updatePrivilege(this.privilegeId, privilegeData)
          .subscribe(
            (vehiclecapacitymodel: Privilege) =>
              this.handleSuccess(
                "Vehicle Capacity Model updated successfully",
                vehiclecapacitymodel
              ),
            (error: any) => this.handleError(error)
          );
      } else {
        this.privilegeService.createPrivilege(privilegeData).subscribe(
          (privilege: Privilege) =>
            this.handleSuccess("Privilege created successfully", privilege),
          (error) => this.handleError(error)
        );
      }
    }
  }

  private handleSuccess(message: string, privilege: Privilege): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedPrivilege = privilege;
    this.operationSuccessful = true;
    this.currentStep = 1; // Move to step 2 to show privilege details
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
  // Navigate back to the privilege list
  resetFormAndNavigateBack(): void {
    this.privilegeForm.reset();
    this.router.navigate(["/um/privilege"]);
  }
}
