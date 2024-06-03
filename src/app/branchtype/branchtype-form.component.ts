import { Component, OnInit, numberAttribute } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { BranchtypeService } from "./services/branchtype.service";
import { BranchType } from "./models/branchtype.model";
import { UserContext } from "../core/models/user-context.model";
import { UserContextService } from "../core/services/user-context.service";

@Component({
  selector: 'app-branchtype-form',
  templateUrl: "./branchtype-form.component.html",
})
export class BranchtypeFormComponent implements OnInit {
  cancel() {
    this.router.navigate(["/md/branchtype"]);
  }
  tenant_id:number | undefined;
  branchtypeForm: FormGroup;
  isEditMode: boolean = false;
  branchtypeId: number | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedBranchtype: BranchType | null = null; // Store the Product type data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private branchtypeService: BranchtypeService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private usercontext: UserContextService
  ) {
    this.branchtypeForm = this.fb.group({
      // tenant_id:[null, Validators.required],
      branch_type: ["", Validators.required],
      description: ["", Validators.required],
      status: ["", Validators.required],
    });
    // Initialize the steps
    this.steps = [{ label: "Branchtype Form" }, { label: "Branchtype Details" }];
  }

  ngOnInit(): void {
    this.tenant_id = this.usercontext.getUserContext()?.tenantId;
    //console.log(this.tenant_id);
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.branchtypeId = params["id"];
        if (this.branchtypeId !== null) {
          this.loadBranchtypeData(this.branchtypeId);
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

  private loadBranchtypeData(id: number): void {
    this.branchtypeService.getBranchtypeById(id).subscribe(
      (branchtype: BranchType) => this.branchtypeForm.patchValue(branchtype),
      (error) => this.handleError(error)
    );
  }

  onSubmit(): void {
    if (this.branchtypeForm.valid) {
      const packagetypeData = this.branchtypeForm.value;
      packagetypeData['tenant_id'] = this.tenant_id;
     // console.log(packagetypeData);
      //console.log("tenant id : ",this.tenant_id);

      if (this.isEditMode && this.branchtypeId) {
        this.branchtypeService.updateBranchtype(this.branchtypeId, packagetypeData).subscribe(
          (branchtype) => this.handleSuccess("BranchType updated successfully", branchtype),
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
        this.branchtypeService.createBranchtype(packagetypeData).subscribe(
          (branchtype) => this.handleSuccess("BranchType created successfully", branchtype),
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


  private handleSuccess(message: string, branchtype: BranchType): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedBranchtype = branchtype;
    this.operationSuccessful = true;
    this.currentStep = 1; // Move to step 2 to show branchtype details
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
  // Navigate back to the branchtype list
  resetFormAndNavigateBack(): void {
    this.branchtypeForm.reset();
    this.router.navigate(["/md/branchtype"]);
  }

}
