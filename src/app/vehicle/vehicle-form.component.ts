import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { VehicleService } from "./services/vehicle.service";
import { Vehicle } from "./models/vehicle.model";
import { MessageService } from "primeng/api";
import { formatDate } from "@angular/common";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-vehicle-form",
  templateUrl: "./vehicle-form.component.html",
  styles: ``,
})
export class VehicleFormComponent implements OnInit {
  cancel() {
    this.router.navigate(["/md/vehicle"]);
  }

  vehicleForm: FormGroup;
  isEditMode: boolean = false;
  srno: number | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedvehicle: Vehicle | null = null; // Store the tenant data after successful operation
  errorMessage: string = ""; // Store error message
  VehicleTypeOptions: any[] = [];
  FTLTypeOptions: any[] = [];
  selectedVehicleType: string = "";
  selectedVehicleFTL: string = "";
  gpsDeviceEnabled: boolean = false;
  constructor(
    private fb: FormBuilder,
    private vehicleservice: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.vehicleForm = this.fb.group({
      VehicleMake: ["", Validators.required],
      Model: ["", Validators.required],
      Vehicle_No: ["", Validators.required],
     // VendorName: ["", Validators.required],
    //  VendorType: ["", Validators.required],
      RegDate: ["", Validators.required],

      Chassis_No: ["", Validators.required],
      Engine_No: ["", Validators.required],
      Payload: ["", Validators.required],
      
      Length: ["", Validators.required],
      Width: ["", Validators.required],
      Height: ["", Validators.required],
      Capacity: ["", Validators.required],
      GVW: ["", Validators.required],
      UnloadedWeight: ["", Validators.required],
      AttachedDate: ["", Validators.required],
      Insurance_Validity: ["", Validators.required],
      Fitness_Validity: ["", Validators.required],
      Permit_validity: ["", Validators.required],
      CertNo: ["", Validators.required],
      InsuranceNo: ["", Validators.required],
      RTONo: ["", Validators.required],

      CloseTrip: ["1"],
      ControllingBranch: ["", Validators.required],
      // AssetType: ["", Validators.required],
     // NoOfDrivers: ["", Validators.required],
      GPSDeviceEnabled: ["", Validators.required],
      PermitStates: ["", Validators.required],
      FTLType: ["", Validators.required],
      VehicleBroker: ["", Validators.required],
      NoOfTyres: ["", Validators.required],
      RCBookNo: ["", Validators.required],
      RegistrationNo: ["", Validators.required],
      InsuranceCompany: ["", Validators.required],
      RC_Validity: ["", Validators.required],
      FitnessCertificateDate: ["", Validators.required],
      RateKm: ["", Validators.required],
      ActiveFlag: ["", Validators.required],
     
     
      Tax_validdity: ["", Validators.required],
      TaxStatus: ["", Validators.required],
      PUCC_Validity: ["", Validators.required],
      Fittness_Validdate: ["", Validators.required],
     // MilageKM: ["", Validators.required],
     StandardMilageKmPerLtr: ["", Validators.required],
      Milage: ["", Validators.required],
      FuelTankCapacity: ["", Validators.required],
   
      UploadRc: ["", Validators.required],
      UploadInsuarance: ["", Validators.required],
      UploadPermit: ["", Validators.required],
      UploadPUC: ["", Validators.required]


  });
// Initialize the steps
this.steps = [{ label: "Vehicle Form" }, { label: "Vehicle Details" }];
}



ngOnInit(): void {
  this.route.params.subscribe((params) => {
    if (params["SrNo"]) {
      this.isEditMode = true;
      this.srno = params["SrNo"];
      console.log('urlsapcode', this.srno);
      if (this.srno !== null) {
        this.loadVehicleData(this.srno);
      }
    }
  });
  this.fetchVehicleModel();
  this.fetchVehiclecpct();

}



onFileChange(event: any, fieldName: string) {
  const file = event.target.files[0];
  if (file) {
      this.vehicleForm.get(fieldName)?.setValue(file);
  }
}


  // Dropdown options for tenant status
  statusOptions = [
    // { label: "NONE", value: null },
    { label: "ACTIVE", value: "1" },
    // { label: "DEACTIVATED", value: "0" },
  ];

// AssetOptions = [
//   { label: "NONE", value: null },
//   { label: "ASSET", value: "ASSET" },
//   { label: "SPARE PARTS", value: "SPARE PARTS" },
// ];

// VendorTypeOptions = [
//   // { label: "NONE", value: null },
//   // { label: "ATTACHED", value: "ATTACHED" },
//   { label: "OWN", value: "OWN" },
// ];


// VendorNameOptions = [
 
//   { label: "VTC 3 PL SERVICES LTD ", value: "VTC 3 PL SERVICES LTD " },
// ];


// Load tenant data for editing
// private loadVehicleData(SrNo: number): void {
//   this.VehicleService.getVehicleById(SrNo).subscribe(
//     (vehicle) => this.vehicleForm.patchValue(vehicle),
//     (error) => this.handleError(error)
//   );
// }




loadVehicleData(SrNo: number): void {
  this.vehicleservice.getVehicleById(SrNo).subscribe(
    (response:any) => {
      const vehicle = response.vehicle; // Extract the customer object from the response
      this.fetchVehicleModel();
      // Format date fields using DatePipe
vehicle.RegDate1 = this.datePipe.transform(vehicle.RegDate, 'yyyy-MM-dd');
vehicle.AttachedDate1 = this.datePipe.transform(vehicle.AttachedDate, 'yyyy-MM-dd');
vehicle.Insurance_Validity1 = this.datePipe.transform(vehicle.Insurance_Validity, 'yyyy-MM-dd');
vehicle.Fitness_Validity1 = this.datePipe.transform(vehicle.Fitness_Validity, 'yyyy-MM-dd');
vehicle.Permit_validity1 = this.datePipe.transform(vehicle.Permit_validity, 'yyyy-MM-dd');
vehicle.FitnessCertificateDate1 = this.datePipe.transform(vehicle.FitnessCertificateDate, 'yyyy-MM-dd');
// vehicle.RateKm1 = this.datePipe.transform(vehicle.RateKm, 'yyyy-MM-dd');
vehicle.Tax_validdate1 = this.datePipe.transform(vehicle.Tax_validdity, 'yyyy-MM-dd');
vehicle.PUCC_Valid1 = this.datePipe.transform(vehicle.PUCC_Validity, 'yyyy-MM-dd');
vehicle.Fittness_Validdate1 = this.datePipe.transform(vehicle.Fittness_Validdate, 'yyyy-MM-dd');
vehicle.RC_Validity1 = this.datePipe.transform(vehicle.RC_Validity, 'yyyy-MM-dd');
console.log("RegDate1", vehicle.RegDate1);

   //   console.log('Fetched date :', formattedDate );
      const statusLabel = vehicle.ActiveFlag === "1" ? 'ACTIVE' : 'DEACTIVATED';
      const gpsDeviceEnabledValue = vehicle.GPSDeviceEnabled === "1";
      // Patch the form with the relevant properties
      this.vehicleForm.patchValue({
        VehicleMake :vehicle.VehicleMake,
        Model: vehicle.Model,
        Vehicle_No: vehicle.Vehicle_No,
        //VendorName: vehicle.VendorName,
     //   VendorType: vehicle.VendorType,
        Payload:vehicle.Payload,
        RegDate: vehicle.RegDate1,
        Chassis_No: vehicle.Chassis_No,
        Engine_No: vehicle.Engine_No,
        Length: vehicle.Length,
        Width: vehicle.Width,
        Height: vehicle.Height,
        Capacity: vehicle.Capacity,
        GVW: vehicle.GVW,
        UnloadedWeight:vehicle.UnloadedWeight,
        AttachedDate: vehicle.AttachedDate1,
        Insurance_Validity: vehicle.Insurance_Validity1,
        Fitness_Validity: vehicle.Fitness_Validity1,
        Permit_validity: vehicle.Permit_validity1,
        CertNo: vehicle.CertNo,
        InsuranceNo: vehicle.InsuranceNo,
        RTONo: vehicle.RTONo,
        CloseTrip: vehicle.CloseTrip,
        ControllingBranch: vehicle.ControllingBranch,
        // AssetType: vehicle.AssetType,
     //   NoOfDrivers: vehicle.NoOfDrivers,
        GPSDeviceEnabled: gpsDeviceEnabledValue,
        PermitStates: vehicle.PermitStates,
        FTLType: vehicle.FTLType,
        VehicleBroker: vehicle.VehicleBroker,
        NoOfTyres: vehicle.NoOfTyres,
        RCBookNo: vehicle.RCBookNo,
        RegistrationNo: vehicle.RegistrationNo,
        InsuranceCompany: vehicle.InsuranceCompany,
        RC_Validity:vehicle.RC_Validity1,
        FitnessCertificateDate: vehicle.FitnessCertificateDate1,
        RateKm: vehicle.RateKm,
        ActiveFlag: vehicle.ActiveFlag,
     
        
        Tax_validdity: vehicle.Tax_validdate1,
        TaxStatus: vehicle.TaxStatus,
        PUCC_Validity: vehicle.PUCC_Valid1,
        Fittness_Validdate: vehicle.Fittness_Validdate1,
        MilageKM: vehicle.MilageKM,
        StandardMilageKmPerLtr:vehicle.StandardMilageKmPerLtr,
        Milage: vehicle.Milage,
        FuelTankCapacity: vehicle.FuelTankCapacity
        // Patch other properties as needed
      });

        console.log("Form after patch:", this.vehicleForm.value);
        this.changeDetectorRef.detectChanges();

        this.isEditMode = true;
        const selectedOption = this.statusOptions.find(
          (option) => option.label === statusLabel
        );
        if (selectedOption) {
          const statusControl = this.vehicleForm.get("ActiveFlag");
          if (statusControl) {
            statusControl.setValue(selectedOption.value);
          }
        }
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  // Handle form submission
  // onSubmit(): void {
  //   if (this.vehicleForm.valid) {
  //     const vehicleData = this.vehicleForm.value;
  //     console.log("vehicleData",vehicleData);
  //     if (this.isEditMode && this.srno) {
  //       this.VehicleService.updateVehicle(this.srno, vehicleData).subscribe(
  //         (vehicle) => this.handleSuccess("vehicle updated successfully", vehicle),
  //         (error) => this.handleError(error)
  //       );
  //     } else {
  //       this.VehicleService.createVehicle(vehicleData).subscribe(
  //         (vehicle) => this.handleSuccess("vehicle created successfully", vehicle),
  //         (error) => this.handleError(error)
  //       );
  //     }
  //   }
  // }

  fetchVehicleModel() {
    this.vehicleservice.getvehcpctmodel().subscribe(
      (response: any) => {
        console.log("Response:", response); // Log the response to see its structure
        if (Array.isArray(response)) {
          this.VehicleTypeOptions = response.map((item: string) => ({
            label: item,
            value: item,
          }));
        } else if (response && Array.isArray(response.vehcpctmodel)) {
          this.VehicleTypeOptions = response.vehcpctmodel.map(
            (item: string) => ({ label: item, value: item })
          );
        } else {
          console.error("Invalid response format:", response);
        }
      },
      (error) => {
        console.error("Error fetching vehicle types:", error);
      }
    );
  }

  fetchVehiclecpct() {
    this.vehicleservice.getVehiclecpct().subscribe(
      (response: any) => {
        console.log("Response vehiclecpct :", response); // Log the response to see its structure
        if (Array.isArray(response)) {
          this.FTLTypeOptions = response.map((item: string) => ({
            label: item,
            value: item,
          }));
        } else if (response && Array.isArray(response.vehiclecpct)) {
          this.FTLTypeOptions = response.vehiclecpct.map((item: string) => ({
            label: item,
            value: item,
          }));
        } else {
          console.error("Invalid response format:", response);
        }
      },
      (error) => {
        console.error("Error fetching vehicle types:", error);
      }
    );
  }

  onSubmit(): void {
    if (this.vehicleForm.valid) {
      // Get the form values
      const vehicleData = this.vehicleForm.value;
      const gpsDeviceEnabledValue = vehicleData.GPSDeviceEnabled ? "1" : "0";
      // Format date fields to 'YYYY-MM-DD'
      const formattedVehicleData = {
        ...vehicleData,
        RegDate: formatDate(vehicleData.RegDate, 'yyyy-MM-dd', 'en-US'),
        AttachedDate: formatDate(vehicleData.AttachedDate, 'yyyy-MM-dd', 'en-US'),
        Insurance_Validity: formatDate(vehicleData.Insurance_Validity, 'yyyy-MM-dd', 'en-US'),
        Fitness_Validity: formatDate(vehicleData.Fitness_Validity, 'yyyy-MM-dd', 'en-US'),
        Permit_validity: formatDate(vehicleData.Permit_validity, 'yyyy-MM-dd', 'en-US'),
        FitnessCertificateDate: formatDate(vehicleData.FitnessCertificateDate, 'yyyy-MM-dd', 'en-US'),
       // RateKm: formatDate(vehicleData.RateKm, 'yyyy-MM-dd', 'en-US'),
       Tax_validdity: formatDate(vehicleData.Tax_validdity, 'yyyy-MM-dd', 'en-US'),
        PUCC_Validity: formatDate(vehicleData.PUCC_Validity, 'yyyy-MM-dd', 'en-US'),
        Fittness_Validdate: formatDate(vehicleData.Fittness_Validdate, 'yyyy-MM-dd', 'en-US'),
        GPSDeviceEnabled: gpsDeviceEnabledValue
      };

      // Log the formatted data
      console.log("vehicleData", formattedVehicleData);

      // Submit the formatted data to the backend
      if (this.isEditMode && this.srno) {
        this.vehicleservice
          .updateVehicle(this.srno, formattedVehicleData)
          .subscribe(
            (vehicle) =>
              this.handleSuccess("vehicle updated successfully", vehicle),
            (error) => this.handleError(error)
          );
      } else {
        this.vehicleservice.createVehicle(formattedVehicleData).subscribe(
          (vehicle) =>
            this.handleSuccess("vehicle created successfully", vehicle),
          (error) => this.handleError(error)
        );
      }
    }
  }

  private handleSuccess(message: string, response: any): void {
    this.createdOrEditedvehicle = response.vehicle;

    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
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
    this.vehicleForm.reset();
    this.router.navigate(["/md/vehicle"]);
  }
}
