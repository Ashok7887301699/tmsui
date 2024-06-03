import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DriverService } from "./services/driver.service";
import { MessageService } from "primeng/api";
import { Driver } from "./models/driver.model";

@Component({
  selector: "app-driver-form",
  templateUrl: "./driver-form.component.html",
})
export class DriverFormComponent implements OnInit {
  DriverPhotoFile: File | undefined;
  PanCardFile: File | undefined;
  AadharCardFile: File | undefined;
  VoterIdFile: File | undefined;
  LicenseFile: File | undefined;

  cancel() {
    this.router.navigate(["/md/drivermaster"]);
  }
  driverForm: FormGroup;
  isEditMode: boolean = false;
  driverId: number | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedDriver: Driver | null = null; // Store the Driver data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.driverForm = this.fb.group({
      FirstName: ["", Validators.required],
      MiddleName: ["", Validators.required],
      LastName: ["", Validators.required],
      SAPId: ["", Validators.required],
      BranchCode: ["", Validators.required],
      DriverCode: ["", Validators.required],
      Location: ["", Validators.required],
      MobileNumber: ["", Validators.required],
      PermanentAddress: ["", Validators.required],
      CurrentAddress: ["", Validators.required],
      LicenseNumber: ["", Validators.required],
      LicenseValidity: ["", Validators.required],
      IssuedByRTO: ["", Validators.required],
      FirstLicenseIssueDate: ["", Validators.required],
      CloseTrip: ["", Validators.required],
      DriverFatherName: ["", Validators.required],
      VehicleNumber: ["", Validators.required],
      PermanentCity: ["", Validators.required],
      PermanentPincode: ["", Validators.required],
      CurrentCity: ["", Validators.required],
      CurrentPincode: ["", Validators.required],
      GuarantorName: ["", Validators.required],
      // Status: ["", Validators.required],
      DriverCategory: ["", Validators.required],
      DOB: ["", Validators.required],
      DOJ: ["", Validators.required],
      Ethinicity: ["", Validators.required],
      CurrentLicenseIssueDate: ["", Validators.required],
      LicenseVerifiedDate: ["", Validators.required],
      LicenseVerified: [false],
      AddressVerified: [false],
      DriverPhoto: ["", Validators.required],
      PanCard: ["", Validators.required],
      VoterId: ["", Validators.required],
      AadharCard: ["", Validators.required],
      License: ["", Validators.required],
    });

    // Initialize the steps
    this.steps = [{ label: "Driver Form" }, { label: "Driver Details" }];
  }

  ngOnInit(): void {
    // Subscribe to route parameters to determine if in edit mode
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.driverId = params["id"];
        if (this.driverId !== null) {
          this.loadDriverData(this.driverId);
        }
      }
    });
  }
  updateCheckboxValue(event: any) {
    const fieldName = event.target.id; // Get the id of the clicked checkbox
    const isChecked = event.target.checked; // Get the checked state of the checkbox
    this.driverForm.get(fieldName)?.setValue(isChecked);
  }

  onFileSelected(
    event: any,
    fileType: "DriverPhoto" | "PanCard" | "VoterId" | "AadharCard" | "License"
  ): void {
    console.log("Inside the onFile Selected method");
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (fileType === "DriverPhoto") {
        this.DriverPhotoFile = file;
        console.log("Driver Photo File : ", this.DriverPhotoFile);
      } else if (fileType === "PanCard") {
        this.PanCardFile = file;
        console.log(" Pan Card : ", this.PanCardFile);
      } else if (fileType === "VoterId") {
        this.VoterIdFile = file;
        console.log(" Voter Id : ", this.VoterIdFile);
      } else if (fileType === "AadharCard") {
        this.AadharCardFile = file;
        console.log(" Aadhar Card : ", this.AadharCardFile);
      } else if (fileType === "License") {
        this.LicenseFile = file;
        console.log(" License : ", this.LicenseFile);
      }
    }
  }

  // Dropdown options for driver status
  statusOptions = [
    // { label: "NONE", value: null },
    // { label: "REGISTERED", value: "REGISTERED" },
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  // Load driver data for editing
  private loadDriverData(id: number): void {
    this.driverService.getDriverById(id).subscribe(
      (Driver) => this.driverForm.patchValue(Driver),
      (error) => this.handleError(error)
    );
  }

  // Handle form submission
  onSubmit(): void {
    if (this.driverForm.valid) {
      const formData = new FormData(); // Create FormData object

      Object.keys(this.driverForm.value).forEach((key) => {
        const value = this.driverForm.value[key];
        if (value instanceof Date) {
          formData.append(key, this.formatDate(value));
        } else {
          formData.append(key, value);
        }
      });
      // Append all form data to FormData
      // Object.keys(this.driverForm.value).forEach((key) => {
      //   // Format LicenseValidity date to "dd.mm.yy" format
      //   if (key === "LicenseValidity" && this.driverForm.value[key]) {
      //     const licenseValidityDate = new Date(this.driverForm.value[key]);
      //     const formattedLicenseValidity = this.formatDate(licenseValidityDate);
      //     formData.append(key, formattedLicenseValidity);
      //   } else {
      //     formData.append(key, this.driverForm.value[key]);
      //   }
      //   // formData.append(key, this.driverForm.value[key]);
      // });

      // Append uploaded files to FormData
      if (this.DriverPhotoFile) {
        formData.append(
          "DriverPhoto",
          this.DriverPhotoFile,
          this.DriverPhotoFile.name
        );
      }
      if (this.PanCardFile) {
        formData.append("PanCard", this.PanCardFile, this.PanCardFile.name);
      }
      if (this.AadharCardFile) {
        formData.append(
          "AadharCard",
          this.AadharCardFile,
          this.AadharCardFile.name
        );
      }
      if (this.VoterIdFile) {
        formData.append("VoterId", this.VoterIdFile, this.VoterIdFile.name);
      }
      if (this.LicenseFile) {
        formData.append("License", this.LicenseFile, this.LicenseFile.name);
      }

      // const driverData = this.driverForm.value;
      if (this.isEditMode && this.driverId) {
        this.driverService.updateDriver(this.driverId, formData).subscribe(
          (driver) => this.handleSuccess("driver updated successfully", driver),
          (error) => this.handleError(error)
        );
      } else {
        this.driverService.createDriver(formData).subscribe(
          (driver) => this.handleSuccess("Driver created successfully", driver),
          (error) => this.handleError(error)
        );
      }
    }
  }

  // Helper function to format date to "dd.mm.yy" format
  private formatDate(date: Date): string {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private handleSuccess(message: string, driver: Driver | null): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedDriver = driver;
    this.operationSuccessful = true;
    this.currentStep = 1; // Move to step 2 to show driver details
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

  // Navigate back to the driver list
  resetFormAndNavigateBack(): void {
    this.driverForm.reset();
    this.router.navigate(["/md/drivermaster"]);
  }

  convertToUppercase(controlName: string) {
    const control = this.driverForm.get(controlName);
    if (control && control.value) {
      control.setValue(control.value.toUpperCase());
    }
  }

  // convertToUppercase(event: any) {
  //   event.target.value = event.target.value.toUpperCase();
  // }
}
