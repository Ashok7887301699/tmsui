import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BranchService } from "./services/branch.service";
import { MessageService } from "primeng/api";
import { Branch } from "./models/branch.model";
import { HttpClient } from "@angular/common/http";
import { UserContext } from "../core/models/user-context.model";
import { UserContextService } from "../core/services/user-context.service";

@Component({
  selector: "app-branch-form",
  templateUrl: "./branch-form.component.html",
})
export class BranchFormComponent implements OnInit {
  cancel() {
    this.router.navigate(["/md/branch"]);
  }

  usrId: number | undefined;
  branchTypeOptions: string[] = [];
  uploadBranchFile: File | undefined;
  uploadShopActFile: File | undefined;
  branchForm: FormGroup;
  isEditMode: boolean = false;
  branchCode: string | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedBranch: Branch | null = null; // Store the Branch data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    private userContextService: UserContextService,
  ) {
    this.branchForm = this.fb.group({
      BranchCode: ["", Validators.required],
      BranchName: ["", Validators.required],
      GSTStateCode: ["", [Validators.required, Validators.pattern(/^\d+$/)]],
      BranchType: [null, Validators.required],
      Latitude: [
        "",
        [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)],
      ],
      Longitude: [
        "",
        [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)],
      ],
      Country: ["", Validators.required],
      State: ["", Validators.required],
      District: ["", Validators.required],
      Taluka: ["", Validators.required],
      City: ["", Validators.required],
      RegionalBranchName: ["", Validators.required],
    });

    // Initialize the steps
    this.steps = [{ label: "Branch Form" }, { label: "Branch Details" }];
  }

  ngOnInit(): void {
    this.usrId = this.userContextService.getUserContext()?.userId;
    console.log("userid : ",this.usrId);
    this.fetchBranchTypes();
    // Subscribe to route parameters to determine if in edit mode
    this.route.params.subscribe((params) => {
      if (params["branchCode"]) {
        this.isEditMode = true;
        console.log("Editmode : ", this.isEditMode);
        this.branchCode = params["branchCode"];
        if (this.branchCode !== null) {
          this.loadBranchData(this.branchCode);
        }
      }
    });
  }

  fetchBranchTypes(): void {
    this.branchService.getBranchTypes().subscribe(
      (branchTypes: string[]) => {
        this.branchTypeOptions = branchTypes;
      },
      (error) => {
        console.error("Error fetching branch types:", error);
        // Handle error
      }
    );
  }

  // Dropdown options for branch status
  statusOptions = [
    { label: "ACTIVE", value: "ACTIVE" },
    // { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  // getStatusOptions() {
  //   // If in edit mode and the branch status is 'Active', show only 'Deactivated' option
  //   if (this.isEditMode && this.branchForm.get('Status')?.value === 'DEACTIVATED') {
  //     return [{ label: 'ACTIVE', value: 'ACTIVE' }];
  //   } else {
  //     return undefined; // Don't show status options
  //   }
  // }

  // branchTypeOptions = [
  //   { label: "BRANCH", value: "BRANCH" },
  //   { label: "CP", value: "CP" },
  //   { label: "HUB", value: "HUB" },
  //   { label: "ONLY DELIVERY", value: "ONLY DELIVERY" },
  //   { label: "ONLY BOOKING", value: "ONLY BOOKING" },
  // ];

  // Load branch data for editing
  private loadBranchData(branchCode: string): void {
    this.branchService.getBranchByCode(branchCode).subscribe(
      (branch) => this.branchForm.patchValue(branch),
      (error) => this.handleError(error)
    );
  }

  onFileSelected(event: any, fileType: "UploadBranch" | "UploadShopAct"): void {
    console.log("Inside the onFile Selected method");
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (fileType === "UploadBranch") {
        this.uploadBranchFile = file;
        console.log("Upload Branch File : ", this.uploadBranchFile);
      } else if (fileType === "UploadShopAct") {
        this.uploadShopActFile = file;
        console.log(" Uplaod Shop Act : ", this.uploadShopActFile);
      }
    }
  }

  onSubmit(): void {
    if (this.branchForm.valid) {
      // Check if the UploadBranch and UploadShopAct fields are null
      if (!this.uploadBranchFile && !this.uploadShopActFile) {
        // Show an error message for both files missing
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please select both images before submitting.",
        });
        return; // Prevent form submission
      } else if (!this.uploadBranchFile) {
        // Show an error message if only the UploadBranch file is missing
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please select the Upload Branch image before submitting.",
        });
        return; // Prevent form submission
      } else if (!this.uploadShopActFile) {
        // Show an error message if only the UploadShopAct file is missing
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please select the Upload Shop Act image before submitting.",
        });
        return; // Prevent form submission
      }

      const formData = new FormData(); // Create FormData object

      // Append all form data to FormData
      Object.keys(this.branchForm.value).forEach((key) => {
        formData.append(key, this.branchForm.value[key]);
      });

      // Append uploaded files to FormData
      if (this.uploadBranchFile) {
        formData.append(
          "UploadBranch",
          this.uploadBranchFile,
          this.uploadBranchFile.name
        );
      }
      if (this.uploadShopActFile) {
        formData.append(
          "UploadShopAct",
          this.uploadShopActFile,
          this.uploadShopActFile.name
        );
      }
      
      formData.append("CreatedBy", String(this.usrId));
      
      if (this.isEditMode && this.branchCode) {
        this.branchService.updateBranch(this.branchCode, formData).subscribe(
          (branch) => this.handleSuccess("Branch updated successfully", branch),
          (error) => this.handleError(error)
        );
      } else {
        this.branchService.createBranch(formData).subscribe(
          (branch) => {
            this.handleSuccess("Branch created successfully", branch),
              this.branchForm.reset();
          },
          (error) => this.handleError(error)
        );
      }
    }
  }

  checkFormValidity(): void {
    console.log("Form validity:", this.branchForm.valid);
  }

  private handleSuccess(message: string, branch: Branch | null): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedBranch = branch;
    this.operationSuccessful = true;
    this.currentStep = 1; // Move to step 2 to show branch details
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

  // Navigate back to the branch list
  resetFormAndNavigateBack(): void {
    this.branchForm.reset();
    this.router.navigate(["/md/branch"]);
  }

  convertToUppercase(event: any, fieldId: string) {
    const inputValue = event.target.value;
    // Check the fieldId to determine which input field triggered the function
    switch (fieldId) {
      case "BranchCode":
        // Convert the input value to uppercase only for the BranchCode field
        this.branchCode = inputValue.toUpperCase();
        break;
      case "BranchName":
        // Convert the input value to uppercase only for the BranchName field
        this.branchForm.get("BranchName")?.setValue(inputValue.toUpperCase());
        break;
      case "City": //ok
        // Convert the input value to uppercase only for the City field
        this.branchForm.get("City")?.setValue(inputValue.toUpperCase());
        break;
      case "Taluka": //ok
        // Convert the input value to uppercase only for the Taluka field
        this.branchForm.get("Taluka")?.setValue(inputValue.toUpperCase());
        break;
      case "District": //ok
        // Convert the input value to uppercase only for the District field
        this.branchForm.get("District")?.setValue(inputValue.toUpperCase());
        break;
      case "State": //ok
        // Convert the input value to uppercase only for the State field
        this.branchForm.get("State")?.setValue(inputValue.toUpperCase());
        break;
      case "Country": //ok
        // Convert the input value to uppercase only for the Country field
        this.branchForm.get("Country")?.setValue(inputValue.toUpperCase());
        break;
      case "RegionalBranchName":
        // Convert the input value to uppercase only for the RegionalBranchName field
        this.branchForm
          .get("RegionalBranchName")
          ?.setValue(inputValue.toUpperCase());
        break;
      default:
        break;
    }
  }
}
