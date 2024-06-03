import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { RoleService } from "./services/role.service";
import { Role } from "./models/role.model";
import { PrivilegeService } from "../privilege/services/privilege.service";
import { Privilege } from "../privilege/models/privilege.model";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";

@Component({
  selector: "app-role-form",
  templateUrl: "./role-form.component.html",
})
export class RoleFormComponent implements OnInit {
  cancel() {
    this.router.navigate(["/um/role"]);
  }
 
  roleForm: FormGroup;
  // privilege: { name: string, description: string }[] = [];
  privileges: any[] = []; // Array to store privileges data
  //  privileges: any[] = []; // Array to store privileges data // Array to store privileges data
  isEditMode: boolean = false;
  roleId: number | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedRole: Role | null = null; // Store the Product type data after successful operation
  errorMessage: string = ""; // Store error message
  selectedPrivileges: string[] = [];

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private privilegeService: PrivilegeService,
    private http: HttpClient
  ) {
    this.roleForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      status: ["", Validators.required],
      privilege_names: ["", Validators.required]
    });
    // Initialize the steps
    this.steps = [{ label: "Role Form" }, { label: "Role Details" }];
  }
  

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.roleId = params["id"];
        if (this.roleId !== null) {
          this.loadRoleData(this.roleId);
        }
      }
    });
    this.loadPrivileges();
  }
  

   // Method to fetch privileges from backend
   loadPrivileges(): void {
    this.privilegeService.getPrivilegeanddescriptions().subscribe(
      (data: any[]) => {
        this.privileges = data.map(privilege => ({
          label: `${privilege.name} - ${privilege.description}`,
          value: privilege.name
        }));
      },
      (error: any) => {
        console.error('Error fetching privileges:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch privileges' });
      }
    );
  }
  
  formatPrivileges(privileges: { name: string, description: string }[]): any[] {
    return privileges.map(privilege => ({
      label: `${privilege.name} - ${privilege.description}`,
      value: privilege.name
    }));
  }
  // Dropdown options
  statusOptions = [
    // { label: "NONE", value: null }, // Allows deselection by setting the value to null
    { label: "ACTIVE", value: "ACTIVE" },
    // { label: "DEACTIVATED", value: "DEACTIVATED" },
    // { label: "BLOCKED", value: "BLOCKED" },
  ];

  private loadRoleData(id: number): void {
    this.roleService.getRoleById(id).subscribe(
      (role: Role) => {
        if (this.roleForm) {
          this.roleForm.patchValue(role); // Patch role data to the form
          const privilegeNames = role.appliedPrivileges ? role.appliedPrivileges.map(privilege => privilege.name) : [];
          this.roleForm.get('privilege_names')?.setValue(privilegeNames); // Set selected privilege names in the form control
        } else {
          console.error('Role form is null');
        }
      },
      (error) => this.handleError(error)
    );
  }
  

  onSubmit(): void {
    if (this.roleForm.valid) {
      const roleData = this.roleForm.value;
      
      // Check if it's in edit mode or create mode
      if (this.isEditMode) {
        // If it's in edit mode, update the existing role
        this.roleService.updateRole(this.roleId!, roleData).subscribe(
          (role: Role) => {
            // Handle success
            this.handleSuccess("Role updated successfully", role);
          },
          (error) => {
            // Handle error
            this.handleError(error);
          }
        );
      } else {
        // If it's in create mode, create a new role
        this.roleService.createRole(roleData).subscribe(
          (role: Role) => {
            // Handle success
            this.handleSuccess("Role created successfully", role);
          },
          (error) => {
            // Handle error
            this.handleError(error);
          }
        );
      }
    }
  }

  private handleSuccess(message: string, role: Role): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedRole = role;
    this.operationSuccessful = true;
    this.currentStep = 1; // Move to step 2 to show role details
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
  // Navigate back to the role list
  resetFormAndNavigateBack(): void {
    this.roleForm.reset();
    this.router.navigate(["/um/role"]);
  }
  generateDisplayLabel(privilege: any): string {
    return `${privilege.name} - ${privilege.description}`;
}
}
