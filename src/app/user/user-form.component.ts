import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "./services/user.service";
import { MessageService } from "primeng/api";
import { User } from "./models/user.model";
import { BranchService } from "../branch/services/branch.service";


@Component({
  selector: 'app-user-form',
  templateUrl: "./user-form.component.html",
})
export class UserFormComponent implements OnInit {
  cancel() {
    this.router.navigate(["/um/user"]);
  }
  roleOptions: string[] = [];
  uploadProfilePhoto: File | undefined;
  branchcodes: any[] = [];
  userForm: FormGroup;
  isEditMode: boolean = false;
  userId: number | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedUser: User | null = null; // Store the tenant data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private branchService: BranchService
  ) {
    this.userForm = this.fb.group({
      tenant_id: ["", Validators.required],
      login_id: ["", Validators.required],
      mobile_no: ["", Validators.required],
      email_id: ["", Validators.required],
      displayname: ["", Validators.required],
      user_type: ["", Validators.required],
      password_hash: ["", Validators.required],
      role_id: ["", Validators.required],
      profile_pic_url: [null,Validators.required], // Updated to handle file upload
      status: ["", Validators.required],
      branch_code: ["", Validators.required],
    });

    // Initialize the steps
    this.steps = [{ label: "User Form" }, { label: "User Details" }];
  }

  ngOnInit(): void {
    this.fetchBranchCodes();
    // Subscribe to route parameters to determine if in edit mode
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.userId = params["id"];
        if (this.userId !== null) {
          this.loadUserData(this.userId);
        }
      }
    });
    // this.loadBranchCodes();
    this.loadRoleNames();
  }

  fetchBranchCodes(): void {
    this.branchService.getBranchCodes().subscribe(
      (branchCodeOnly: string[]) => {
        this.branchcodes = branchCodeOnly;
      },
      (error) => {
        console.error("Error fetching branch types:", error);
      }
    );
  }

  loadRoleNames(): void {
    this.userService.getRoleNames().subscribe(
      (roleNames: string[]) => {
        this.roleOptions = roleNames; // Assign fetched role names to roleOptions array
      },
      (error: any) => {
        console.error('Error fetching role names:', error);
        // Handle error if necessary
      }
    );
  }

  // Method to fetch privileges from backend
  // loadBranchCodes(): void {
  //   this.branchService.getBranchCodes().subscribe(
  //     (data: any[]) => {
  //       this.branchcodes = data.map(branchcode => ({
  //         label: `${branchcode.BranchCode}`,
  //         value: branchcode.BranchCode
  //       }));
  //     },
  //     (error: any) => {
  //       console.error('Error fetching branchcodes:', error);
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch branchcodes' });
  //     }
  //   );
  // }

  // fetchdeponame() {
  //   this.userService.getdepotname().subscribe(
  //     (response: any) => {
  //       console.log("Response:", response); // Log the response to see its structure
  //       if (Array.isArray(response)) {
  //         this.deponameOptions = response.map((item: string) => ({
  //           label: item,
  //           value: item,
  //         }));
  //       } else if (response && Array.isArray(response.BranchCode)) {
  //         this.deponameOptions = response.BranchCode.map(
  //           (item: string) => ({ label: item, value: item })
  //         );
  //       } else {
  //         console.error("Invalid response format:", response);
  //       }
  //     },
  //     (error:any) => {
  //       console.error("Error fetching vehicle types:", error);
  //     }
  //   );
  // }

  userOptions = [
    { label: "S_OWNER", value: "S_OWNER" },
    { label: "S_EMPLOYEE", value: "S_EMPLOYEE" },
    { label: "S_PARTNER", value: "S_PARTNER" },
    { label: "T_OWNER", value: "T_OWNER" },
    { label: "T_EMPLOYEE", value: "T_EMPLOYEE" },
    { label: "T_CHANNEL_PARTNER", value: "T_CHANNEL_PARTNER" },
    { label: "T_TRANSPORT_AGENT", value: "T_TRANSPORT_AGENT" },
    { label: "T_FLEET_OWNER", value: "T_FLEET_OWNER" },
    { label: "T_CUSTOMER", value: "T_CUSTOMER" },
    { label: "T_VENDOR", value: "T_VENDOR" },

  ]
  // Dropdown options for user status
  statusOptions = [
    // { label: "NONE", value: null },
    // { label: "REGISTERED", value: "REGISTERED" },
    { label: "ACTIVE", value: "ACTIVE" },
    // { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  private loadUserData(id: number): void {
    this.userService.getUserById(id).subscribe(
      (user: User) => {
        if (this.userForm) {
          this.userForm.patchValue(user); // Patch user data to the form
          // const branchCode = user.appliedBranchCode && user.appliedBranchCode.length > 0 ? user.appliedBranchCode[0].BranchCode : null;
          // this.userForm.get('branch_code')?.setValue(branchCode); // Set selected branch code in the form control
        } else {
          console.error('User form is null');
        }
      },
      (error) => this.handleError(error)
    );
  }
  // Method to handle file selection for profile picture upload
  onFileSelected(
    event: any,
    fileType: "profile_pic_url"): void {
    console.log("Inside the onFile Selected method");
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (fileType === "profile_pic_url") {
        this.uploadProfilePhoto = file;
        console.log("ProfilePhoto File : ", this.uploadProfilePhoto);
      }
    }
  }
  // Handle form submission
  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = new FormData();
  
      // Append form data
      for (const key of Object.keys(this.userForm.value)) {
        const value = this.userForm.value[key];
        formData.append(key, value);
      }
  
      // Append profile picture file if selected
      if (this.uploadProfilePhoto) {
        formData.append('profile_pic_url', this.uploadProfilePhoto, this.uploadProfilePhoto.name);
      }
  
      if (!this.isEditMode) {
        // Create user
        this.userService.createUser(formData).subscribe(
          (user) => this.handleSuccess("User created successfully", user),
          (error) => this.handleError(error)
        );
      } else if (this.isEditMode && this.userId) {
        // Append userId to formData
        formData.append('userId', this.userId.toString());
  
        // Update user
        this.userService.updateUser(this.userId, formData).subscribe(
          (user) => this.handleSuccess("User updated successfully", user),
          (error) => this.handleError(error)
        );
      }
    }
  }
  

  //  // Method to handle form submission
  //  onSubmit(): void {
  //   if (this.userForm.valid) {
  //     // Prepare user data including profile picture URL
  //     const userData: User = {
  //       tenant_id: this.userForm.get('tenant_id')?.value,
  //       login_id: this.userForm.get('login_id')?.value,
  //       mobile_no: this.userForm.get('mobile_no')?.value,
  //       email_id: this.userForm.get('email_id')?.value,
  //       displayname: this.userForm.get('displayname')?.value,
  //       user_type: this.userForm.get('user_type')?.value,
  //       password_hash: this.userForm.get('password_hash')?.value,
  //       role_id: this.userForm.get('role_id')?.value,
  //       status: this.userForm.get('status')?.value,
  //       profile_pic_url: this.uploadProfilePhoto ? this.uploadProfilePhoto.name : '', // Use an empty string if no file is selected
  //     };

  //     // Check if profile picture is selected
  //     if (!this.uploadProfilePhoto) {
  //       this.handleError({ message: 'Please select a profile picture.' });
  //       return;
  //     }

  //     // Check if it's an edit mode or creation mode and call respective service method
  //     if (this.isEditMode && this.userId) {
  //       this.userService.updateUser(this.userId, userData).subscribe(
  //         (user) => this.handleSuccess("User updated successfully", user),
  //         (error) => this.handleError(error)
  //       );
  //     } else {
  //       this.userService.createUser(userData).subscribe(
  //         (user) => this.handleSuccess("User created successfully", user),
  //         (error) => this.handleError(error)
  //       );
  //     }
  //   }
  // }



  private handleSuccess(message: string, response: any): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedUser = response.user; // Accessing the user object from the response
    this.operationSuccessful = true;
    this.currentStep = 1; // Move to step 2 to show user details
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

  // Navigate back to the user list
  resetFormAndNavigateBack(): void {
    this.userForm.reset();
    this.router.navigate(["/um/user"]);
  }
}
function elseif() {
  throw new Error("Function not implemented.");
}

