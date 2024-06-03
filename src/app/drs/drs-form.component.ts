import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DrsService } from "./services/drs.service";
import { MessageService } from "primeng/api";
import { Drs } from "./models/drs.model";

@Component({
  selector: "app-drs-form",
  templateUrl: "./drs-form.component.html",
})
export class DrsFormComponent implements OnInit {
  drsForm: FormGroup;
  isEditMode: boolean = false;
  drsId: number | null = null;
  steps: any[] = []; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedDrs: Drs | null = null; // Store the tenant data after successful operation
  errorMessage: string = ""; // Store error message
  VendorNameOptions: any[] = [];
  VehicleNoOptions: any[] = [];
  DriverNameOptions: any[] = [];
  VehicleCapacityOptions: any[] = [];
  filteredCustomLrnum: any[] = [];
  rows: any[] = []; 
  total_box_qty: number = 0;
  totaltopay: number = 0;
  total_bag_qty: number = 0;
  actual_box_weight: number = 0;
  actual_bag_weight: number = 0;
  showStep1: boolean = false;
  driverName: string = '';
  mobileno: any; 
  sentOtp?: any; // Declare sentOtp property
  otpMismatch: boolean = false;
  currentSeqNum: number = 1;
  hamaliNames: any[] = [];
  fuelName: any[] =[];



  constructor(
    private fb: FormBuilder,
    private drsService: DrsService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {

    this.drsForm = this.fb.group({
      tenant_id: [null],
      lr_id:[""],
      // fleet_vendor_id: [""],
      vendortype: [""],
      vehicle_model_by_capacity: [{ value: "", disabled: true }],
      ownername: [""],
      VendorName: [""],
      vehicle_num: [""],
      freighttype: [""],
      trip_distance_km_est: [""],
      vehicle_meter_reading_trip_start: [""],
      driver_name: [""],
      driver_mobile: [""],
      dl_num: [""],
      freight_charges: [""],
      dl_expiry_datetime: [""],
      // capacitymodelno: [{ value: "", disabled: true }, Validators.required],
      accountno: [""],
      ifsccode: [""],
      bank: [""],
      branch: [""],
      otp: [""],
      Rate: [""],
      liter: [""],
      advanceamount: [""],
      advancetype: [""],
      contractamt: [""],
      totaltopay: [""],
      percentage: [""],
      PetrolPumpName: [""],
      Dieselbillno: [""],
      Hvendor: [""],
      hamali: [""],
      dieselamt: [""],
      Hvendortype: [""],
      hamalitemp:[""],
      hamalitotal:[""],
      id: [""],
      drs_data: this.fb.array([]),

      // status: [""]
    });

    this.steps = [{ label: "Drs Form" }, { label: "Drs Details" }];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.drsId = params["id"];
        if (this.drsId !== null) {
          this.loadDrsData(this.drsId);
        }
      }
    });

    this.onVendorTypeChange();
    this.getHamaliNames();
    this.getFuelnames();
  }



  filterLr(event: any): void {
    const query = event.query;
    this.drsService.getLsdata(query).subscribe(
      (data: any[]) => {

        this.filteredCustomLrnum = data.map(item => ({ label: item.id, value: item.id }));
      },
      (error) => {
        console.error("Error fetching LR data:", error);
        // Handle error
      }
    );
  }

  addRow(): void {
    const lsControl = this.drsForm.get('id');
    if (lsControl && typeof lsControl.value === 'string') {
      const lsId = lsControl.value.trim(); 
      this.drsService.getLsDetails(lsId).subscribe(
        (lsDetails: any) => {
          const newRow = this.createTableRow(lsDetails);

          const bodyTemplate = document.querySelector('#lrdetailsbody');
          if (bodyTemplate) {
            bodyTemplate.appendChild(newRow);
            this.updateTotalBoxNo();
            this.updateTotalBagNo();
            this.updateTotalboxactual_weight();
            this.updateTotalbagactual_weight();
          } else {
            console.error("Body template not found.");
          }
      
        },
        (error) => {
          console.error("Error fetching LR details:", error);
        
        }
      );
    } else if (lsControl && typeof lsControl.value === 'object' && 'value' in lsControl.value) {
    
      const lsId = lsControl.value.value.trim();
  
      this.drsService.getLsDetails(lsId).subscribe(
        (lsDetails: any) => {
          const newRow = this.createTableRow(lsDetails);

          const totalPackages = lsDetails.total_bag_qty + lsDetails.total_box_qty;
          const pkgsNoInput = newRow.querySelector('.PkgsNo') as HTMLTableCellElement;

          if (pkgsNoInput) {
           pkgsNoInput.textContent = totalPackages.toString();
           }
          
          const bodyTemplate = document.querySelector('#lrdetailsbody');

          if (bodyTemplate) {
            bodyTemplate.appendChild(newRow);
            this.updateTotalBoxNo();
            this.updateTotalBagNo();
            this.updateTotalboxactual_weight();
            this.updateTotalbagactual_weight();
          } else {
            console.error("Body template not found.");
          }
        
        },
        (error) => {
          console.error("Error fetching Ls details:", error);
        }
      );
    } else {
      console.error("Ls number input is empty or invalid.");
    }
  }
  
  createTableRow(lsDetails: any): HTMLTableRowElement {

    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="seq_num" style="text-align: center; display:none">
            <input type="hidden" class="seq-num" value="${this.currentSeqNum}" formControlName="seq_num" pInputText>
        </td>
        <td class="LSNO" style="text-align: center;border:1px solid #ddd;">${lsDetails.ls_id || '0'}</td>
        <td class="LSDate" style="text-align: center;border:1px solid #ddd;" >${(lsDetails.dated || '0000-00-00').split(' ')[0]}</td>
        <td class="PkgsNo" style="text-align: center;border:1px solid #ddd;" >${lsDetails.num_of_pkgs || 'NA'}</td>
        <td class="total_weight" style="text-align: center;border:1px solid #ddd;">${lsDetails.total_weight || 'NA'}</td>
        <td class="total_box_qty" style="text-align: center;border:1px solid #ddd;">${lsDetails.total_box_qty || 'NA'}</td>
        <td class="actual_box_weight" style="text-align: center;border:1px solid #ddd;" >${lsDetails.actual_box_weight || '0'}</td>
        <td class="total_bag_qty" style="text-align: center;border:1px solid #ddd;">${lsDetails.total_bag_qty || '0'}</td>
        <td class="actual_bag_weight" style="text-align: center;border:1px solid #ddd;">${lsDetails.actual_bag_weight || '0'}</td>
        <td class="Dockettotal" style="text-align: center;border:1px solid #ddd;">${lsDetails.total_topay || '0'}</td>
        <td class="viewloadingsheet" style="display:none!important;border:1px solid #ddd;">${lsDetails.viewloadingsheet || '0'}</td>
        <td></td>
        <td style="text-align: center;border:1px solid #ddd;"><button class="delete-btn" style="border:none;background-color: white;cursor: pointer;"><i class="pi pi-trash action-icons"></i></button></td>
    `;

    const seqNumInput = row.querySelector('.seq-num') as HTMLInputElement;
    seqNumInput.value = this.currentSeqNum.toString();
    this.currentSeqNum++;

    const deleteButton = row.querySelector('.delete-btn') as HTMLButtonElement;
    deleteButton.addEventListener('click', () => this.deleteRow(row));

    // Update Total ToPay if payment_type is TO PAY
    if (lsDetails.payment_type === 'TOPAY') {
        const totalToPayInput = document.getElementById('TotalToPay') as HTMLInputElement;
        const currentTotalToPay = parseFloat(totalToPayInput.value) || 0;
        const docketTotal = parseFloat(lsDetails.docket_total_charges) || 0;
        totalToPayInput.value = (currentTotalToPay + docketTotal).toFixed(2);
    }

    return row;
}


  
updateTotalBoxNo(): void {
  let totalBoxQty = 0;
  const boxNoInputs = document.querySelectorAll('.total_box_qty');
  boxNoInputs.forEach((element) => {
    const input = element as HTMLTableCellElement;
    totalBoxQty += parseInt(input.textContent || '0', 10); 
  });

  const totalBoxElement = document.getElementById('totalboxqty');
  if (totalBoxElement) {
    totalBoxElement.textContent = totalBoxQty.toString();
  }
}


updateTotalBagNo(): void {
  let total_bag_qty = 0;
  const bagNoInputs = document.querySelectorAll('.total_bag_qty');
  bagNoInputs.forEach((element) => {
    const input = element as HTMLTableCellElement;
    total_bag_qty += parseInt(input.textContent || '0', 10); 
  });

  const totalBoxElement = document.getElementById('totalbagqty');
  if (totalBoxElement) {
    totalBoxElement.textContent = total_bag_qty.toString();
  }
}

updateTotalboxactual_weight() {
  this.actual_box_weight = 0;
  const actual_box_weightInput = document.querySelectorAll('.actual_box_weight');
  actual_box_weightInput.forEach((element) => {
      const input = element as HTMLInputElement;
      this.actual_box_weight += parseInt(input.textContent || '0', 10);
  });

  const actual_box_weightElement = document.getElementById('totalboxwt');
  if (actual_box_weightElement) {
    actual_box_weightElement.textContent = this.actual_box_weight.toString();
  }
}

updateTotalbagactual_weight() {
  this.actual_bag_weight = 0;
  const actual_bag_weightInput = document.querySelectorAll('.actual_bag_weight');
  actual_bag_weightInput.forEach((element) => {
      const input = element as HTMLInputElement;
      this.actual_bag_weight += parseInt(input.textContent || '0', 10);
  });

  const actual_bag_weightElement = document.getElementById('totalbagwt');
  if (actual_bag_weightElement) {
    actual_bag_weightElement.textContent = this.actual_bag_weight.toString();
  }
}


  
deleteRow(row: HTMLTableRowElement): void {
  const tbody = row.parentNode;
  if (tbody) {
      tbody.removeChild(row);
      this.updateTotalBoxNo();
      this.updateTotalBagNo();
      this.updateTotalboxactual_weight();
      this.updateTotalbagactual_weight();
  }
}

sum(): void {
  const n1Input = (document.getElementById('liter') as HTMLInputElement).value;
  const n2Input = (document.getElementById('Rate') as HTMLInputElement).value;
  
  const n1 = parseFloat(n1Input);
  const n2 = parseFloat(n2Input);
  const n5 = n1 * n2;


  (document.getElementById('dieselamt') as HTMLInputElement).value = n5.toString();
}

toggleStep1(): void {
  const vendortypeElement = <HTMLSelectElement>document.getElementById('vendortype');
  const vendorType = this.drsForm.get('vendortype')!.value;
    
  if (vendorType === 'ATTACHED') {

    if (this.isAttachedFieldsFilled()) {
        this.displayStep1();
    }
  } else if (vendorType === 'OWN') {
    if (this.isOwnFieldsFilled()) {
      this.displayStep1();
    }
  }
}

isAttachedFieldsFilled(): boolean {
  return (
    (this.drsForm.get('ownername')?.value !== '') &&
    (this.drsForm.get('driver_name')?.value !== '') &&
    (this.drsForm.get('dl_num')?.value !== '') &&
    (this.drsForm.get('accountno')?.value !== '') &&
    (this.drsForm.get('ifsccode')?.value !== '') &&
    (this.drsForm.get('bank')?.value !== '') &&
    (this.drsForm.get('branch')?.value !== '')
  );
}

isOwnFieldsFilled(): boolean {
  return (
    (this.drsForm.get('ownername')?.value !== '') &&
    (this.drsForm.get('vehicle_num')?.value !== '') &&
    (this.drsForm.get('freighttype')?.value !== '') &&
    (this.drsForm.get('driver_name')?.value !== '') &&
    (this.drsForm.get('dl_num')?.value !== '')
  );
}

displayStep1(): void {
  const step1Div = document.getElementById('step1');
 

  if (step1Div) {
    step1Div.style.display = 'block';
  } else {
    console.error("Step 1 div not found.");
  }
}




sendOtp(): void {
  const mobilenoControl = this.drsForm.get('driver_mobile');
  if (mobilenoControl && mobilenoControl.valid) {
    const mobileNo: string = mobilenoControl.value;
    this.drsService.sendOtp(mobileNo).subscribe(
      otp => {
        this.sentOtp = otp; // Store the sent OTP
        alert('OTP Sent To Your Mobile Number: ' + this.sentOtp);
        console.log("err this.sentOtp", this.sentOtp);

      },
      error => {
        console.error('Failed to send OTP:', error);
        alert('Failed to send OTP. Please try again.');
        console.log("err this.sentOtp", this.sentOtp);

      }
    );
  } else {
    alert('Please enter a valid mobile number.');
  }
}

verifyOtp(): void {
  const otpControl = this.drsForm.get('otp');
  if (otpControl && otpControl.valid) {
    const enteredOtp = otpControl.value;
    console.log('enteredOtp:', enteredOtp);
    console.log('this.sentOtp:', this.sentOtp);
    if (enteredOtp === this.sentOtp) {
    
    } else {
      this.otpMismatch = true;
    }
  } else {
    this.otpMismatch = true;
  }
}

getHamaliNames(): void {
  this.drsService.gethamaliname().subscribe(
    (data: any[]) => {
      this.hamaliNames = data.map(item => ({
        label: item.Hvendor,
        value: item.VendorCode
      }));
    },
    (error) => {
      console.error('Error fetching hamali names:', error);
    }
  );
}

getFuelnames(): void {
  this.drsService.getFuelNames().subscribe(
    (data: any[]) => {
      this.fuelName = data.map(item => ({
        label: item.PetrolPumpName,
        value: item.PetrolPumpName
      }));
    },
    (error) => {
      console.error('Error fetching fuel names:', error);
    }
  );
}



  
  
  

  

  
  
  
  
    

  statusOptions = [
    // { label: "NONE", value: null }, // Allows deselection by setting the value to null
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];


  HvendorOptions = [
    // { label: "NONE", value: null }, // Allows deselection by setting the value to null
    { label: "Regular", value: "Regular" },
    { label: "Crossing", value: "Crossing" },
  ];

  vendortypeOptions = [
    // { label: "NONE", value: null }, // Allows deselection by setting the value to null
    { label: "ATTACHED", value: "ATTACHED" },
    { label: "OWN", value: "OWN" },
  ];

  private loadDrsData(id: number): void {
    this.drsService.getDrsById(id).subscribe(
      (drs: Drs) => this.drsForm.patchValue(drs),
      (error) => this.handleError(error)
    );
  }



  
  onVendorTypeChange(): void {
    const selectedType = this.drsForm.get("vendortype")?.value;

    if (selectedType !== null) {
      if (selectedType === "ATTACHED") {
        this.drsService.getVendorName().subscribe(
          (response: any[]) => {
            console.log("Received Attached Vendor Data:", response);
            this.VendorNameOptions = response.map((vendor) => ({
              label: `${vendor.VendorCode} - ${vendor.VendorName}`,
              value: vendor.VendorName,
            }));
          },
          (error) => {
            console.error("Error fetching attached vendor data:", error);
            // Handle error
          }
        );
        this.loadVehicleCapacity();
        this.drsForm.get("vehicle_model_by_capacity")?.enable();
        this.drsForm.get("driverName")?.reset();
        this.drsForm.get("vehicleNo")?.reset();
        this.DriverNameOptions = [];
        this.enableFields();
      } else if (selectedType === "OWN") {
        this.drsService.getOwnVendorNames().subscribe(
          (response: any) => {
            console.log("Received Own Vendor Data:", response);
            // Convert object values to array
            const vendorNamesArray = Object.values(response);
            // Map to label-value pairs
            this.VendorNameOptions = vendorNamesArray.map((vendorName) => ({
              label: vendorName,
              value: vendorName,
            }));
          },

          (error) => {
            console.error("Error fetching own vendor data:", error);
            // Handle error
          }
        );
        this.loadDriverNames();
        this.drsForm.get("capacitymodelno")?.reset();
        this.drsForm.get("vendorName")?.reset();
        this.drsForm.get("vehicleNo")?.reset();

        this.drsForm.get("capacitymodelno")?.disable();
        this.disableFields();
      }
    } else {
      this.VendorNameOptions = [{ label: "Select Vendor Name", value: null }];
      this.drsForm.get("VendorName")?.setValue(null);
    }
  }

  enableFields() {
    this.drsForm.get("accountno")?.enable();
    this.drsForm.get("ifsccode")?.enable();
    this.drsForm.get("bank")?.enable();
    this.drsForm.get("branch")?.enable();
  }

  disableFields() {
    this.drsForm.get("accountno")?.disable();
    this.drsForm.get("ifsccode")?.disable();
    this.drsForm.get("bank")?.disable();
    this.drsForm.get("branch")?.disable();
    this.drsForm.get("accountno")?.reset();
    this.drsForm.get("ifsccode")?.reset();
    this.drsForm.get("bank")?.reset();
    this.drsForm.get("branch")?.reset();
  }

  onVendorNameChange(): void {
    const selectedVendorName = this.drsForm.get("VendorName")?.value;
    if (selectedVendorName) {
      if (this.isOwnVendorSelected()) {
        this.drsService.getVehicleNumbers(selectedVendorName).subscribe(
          (response: any[]) => {
            console.log("Received Vehicle Numbers:", response);
            this.VehicleNoOptions = response.map((vehicleNo) => ({
              label: vehicleNo,
              value: vehicleNo,
            }));
          },
          (error) => {
            console.error("Error fetching vehicle numbers:", error);
            // Handle error
          }
        );
      } else {
        // Clear the vehicle number options or reset the form control for vehicle number
        this.VehicleNoOptions = [];
        this.drsForm.get("vehicleNo")?.setValue(null);
      }
    }
  }
  loadDriverNames(): void {
    if (this.isOwnVendorSelected()) {
      this.drsService.getDriverNames().subscribe(
        (response: any) => {
          // Convert object to array of objects with label and value properties
          const driverNamesArray = Object.values(response).map(
            (driverName) => ({
              label: driverName,
              value: driverName,
            })
          );
          this.DriverNameOptions = driverNamesArray;
          console.log("driverNamesArray", driverNamesArray);
        },
        (error) => {
          console.error("Error fetching driver names:", error);
        }
      );
    } else {
      this.DriverNameOptions = []; // Empty the driver name options if vendor type is not 'OWN'
    }
  }
  loadVehicleCapacity(): void {
    if (this.isAttachedVendorSelected()) {
      this.drsService.getVehicleCapacity().subscribe(
        (response: any) => {
          console.log("vehicle capacity", response);
          const VehicleCapacityArray = Object.values(response).map(
            (capacitymodelno) => ({
              label: capacitymodelno,
              value: capacitymodelno,
            })
          );
          this.VehicleCapacityOptions = VehicleCapacityArray;
        },
        (error) => {
          console.error("Error fetching vehicle capacity:", error);
        }
      );
    } else {
      this.VehicleCapacityOptions = []; // Empty the vehicle capacity options if vendor type is not 'ATTACHED'
    }
  }

  isOwnVendorSelected(): boolean {
    return this.drsForm.get("vendortype")?.value === "OWN";
  }
  isAttachedVendorSelected(): boolean {
    return this.drsForm.get("vendortype")?.value === "ATTACHED";
  }

 onSubmit(): void {
    if (this.drsForm.valid) {
      const drsData: Drs = this.drsForm.value;
      this.drsService.createDrs(drsData).subscribe(
        (drs) => this.handleSuccess("Drs created successfully", drs),
        (error) => this.handleError(error)
      );
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private handleSuccess(message: string, drs: Drs | null): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedDrs = drs;
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

  cancel(): void {
    this.router.navigate(["/fm/drs"]);
    this.drsForm.reset(); // Reset the form when canceling the operation
  }

  resetFormAndNavigateBack(): void {
    this.drsForm.reset();
    this.router.navigate(["/fm/drs"]);
  }
}
