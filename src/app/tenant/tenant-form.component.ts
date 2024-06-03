import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TenantService } from "./services/tenant.service";
import { MessageService } from "primeng/api";
import { Tenant } from "./models/tenant.model";

@Component({
  selector: "app-tenant-form",
  templateUrl: "./tenant-form.component.html",
})
export class TenantFormComponent implements OnInit {
  cancel() {
    this.router.navigate(["/md/tenants"]);
  }
  tenantForm: FormGroup;
  isEditMode: boolean = false;
  tenantId: number | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedTenant: Tenant | null = null; // Store the tenant data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.tenantForm = this.fb.group({
      // Define the form controls and validation rules
      name: ["", Validators.required],
      country: ["", Validators.required],
      state: ["", Validators.required],
      city: ["", Validators.required],
      short_name: ["", Validators.required],
      logo_url: [""],
      description: [""],
      status: ["", Validators.required],
    });

    // Initialize the steps
    this.steps = [{ label: "Tenant Form" }, { label: "Tenant Details" }];
  }

  ngOnInit(): void {
    // Subscribe to route parameters to determine if in edit mode
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.tenantId = params["id"];
        if (this.tenantId !== null) {
          this.loadTenantData(this.tenantId);
        }
      }
    });
  }

  // Dropdown options for tenant status
  statusOptions = [
    // { label: "NONE", value: null },
    // { label: "REGISTERED", value: "REGISTERED" },
    { label: "ACTIVE", value: "ACTIVE" },
    // { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  // Load tenant data for editing
  private loadTenantData(id: number): void {
    this.tenantService.getTenantById(id).subscribe(
      (tenant) => this.tenantForm.patchValue(tenant),
      (error) => this.handleError(error)
    );
  }

  // Handle form submission
  onSubmit(): void {
    if (this.tenantForm.valid) {
      const tenantData = this.tenantForm.value;
      if (this.isEditMode && this.tenantId) {
        this.tenantService.updateTenant(this.tenantId, tenantData).subscribe(
          (tenant) => this.handleSuccess("Tenant updated successfully", tenant),
          (error) => this.handleError(error)
        );
      } else {
        this.tenantService.createTenant(tenantData).subscribe(
          (tenant) => this.handleSuccess("Tenant created successfully", tenant),
          (error) => this.handleError(error)
        );
      }
    }
  }

  private handleSuccess(message: string, tenant: Tenant | null): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedTenant = tenant;
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

  // Navigate back to the tenant list
  resetFormAndNavigateBack(): void {
    this.tenantForm.reset();
    this.router.navigate(["/md/tenants"]);
  }
}
