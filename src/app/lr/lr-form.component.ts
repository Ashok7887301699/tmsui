import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators,FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LrService } from "./services/lr.service";
import { MessageService } from "primeng/api";
import { Lr } from "./models/lr.model";
import { AutoCompleteModule } from "primeng/autocomplete";
import { DropdownModule } from "primeng/dropdown"; // Import DropdownModule
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';


@Component({
  selector: "app-lr-form",
  templateUrl: "./lr-form.component.html",
  
})

export class LrFormComponent implements OnInit {
  showdialog1:boolean=false;
  itemsForm!: FormGroup;
  lrForm: FormGroup;
  isEditMode: boolean = false;
  lraddrowForm: FormGroup;
  lrId: number | null = null;
  suggestions: any[] = []; // Assuming this is where you store your autocomplete suggestions
   
  items: any[] = []; 
    steps: any[] = []; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedLr: Lr | null = null; // Store the tenant data after successful operation
  errorMessage: string = ""; // Store error message
  PayTypeOptions: any[] = [];
  lrdate:any;
  selectedConsignorType: any;
  selectedConsigneeTypes: any;
  PackageTypeOptions:any;
  ProductTypeOptions:any;
  totalGross: number = 0;
  totalnoofpkg: number = 0;
  totalperpkg: number = 0;
  truck_load_typeOptions:any[]=[];
  selectedTruckLoadType: any;
  pickup_del_typeOptions:any[]=[];

  contractId: string = '';
  Invoicenoofpkg: string = '';
  ingredient: string = '';
  

  
  constructor(
    private http:HttpClient,
    private fb: FormBuilder,
    private lrService: LrService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private LrService:LrService,
    private confirmationService: ConfirmationService,

  ) {
    
    this.lrForm = this.fb.group({
      payment_type: ["", Validators.required],
      truck_load_type: ["", Validators.required],
      del_speed: ["", Validators.required],
      pickup_del_type: ["", Validators.required],
      Invoiceno: ["", Validators.required],
      Invoicedate: ["", Validators.required],
      Invoicegrossval: ["", Validators.required],
      noofpkg: ["", Validators.required],
      akcwtperpkg: ["", Validators.required],
      akcwt: ["", Validators.required],
      exeesrate: ["", Validators.required],
      booking_date_time: ["", Validators.required],
      consignor_id: ["", Validators.required],
      consignor_name: ["", Validators.required],
      from_place: ["", Validators.required],
      to_place: ["", Validators.required],
      tcity: ["", Validators.required],
      fmaster: ["", Validators.required],
      // depot: ["", Validators.required],
      fmasterconsi: ["", Validators.required],
      conadd: ["", Validators.required],
      MobileNo: ["", Validators.required],
      gstno: ["", Validators.required],
      from_place_con: ["", Validators.required],
      to_place_con: ["", Validators.required],
      Address_con: ["", Validators.required],
      MobileNo_con: ["", Validators.required],
      gstno_con: ["", Validators.required],
      walkin: ["", Validators.required],
      frmasterconsigadd: ["", Validators.required],
      frmasterconsigmob: ["", Validators.required],
      frmasterconsiggst: ["", Validators.required],
      frmaster1: ["", Validators.required],
      frmasterconsi: ["", Validators.required],
      frmasterconsiadd: ["", Validators.required],
      frmasterconsimob: ["", Validators.required],
      frmasterconsigst: ["", Validators.required],
      ewaybill: ["", Validators.required],
      checkinc: ["", Validators.required],
      Product_type: ["", Validators.required],
      checkcod: ["", Validators.required],
      frtrate: ["", Validators.required],
      frtcharge: ["", Validators.required],
      inscharge: ["", Validators.required],
      codcharge: ["", Validators.required],
      doccharge: ["", Validators.required],
      hamalicharge: ["", Validators.required],
      Packaging_type: ["", Validators.required],
      excescharge: ["", Validators.required],
      doorcharge: ["", Validators.required],
      gstcharge: ["", Validators.required],
      odacharge: ["", Validators.required],
      grandtot: ["", Validators.required],
      freight_rate_type: ["", Validators.required],
      con_name: ["", Validators.required],

      // status: ["", Validators.required]
    });
    this.lraddrowForm = this.fb.group({
      lraddrow: this.fb.array([])
    });
    this.items = [
      { value: '' }, // Initialize each item with an empty value
      { value: '' },
      // Add more items if needed
    ];
    this.formGroup = this.fb.group({
      payment_type: ['', Validators.required], // Assuming this is your payment_type form control
      consignor_id: [''] // Assuming this is your consignor_id form control
      
    });
    

    this.steps = [{ label: "Lr Form" }, { label: "Lr Details" }];
  }
  fetchSlabDefinitions() {
    return this.http.get<any[]>('/api/contract_slab_definitions'); // Adjust the URL as per your API endpoint
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.lrId = params["id"];
        if (this.lrId !== null) {
          this.loadLrData(this.lrId);
        }
      }
    });
    this.lraddrowForm = this.fb.group({
      lraddrow: this.fb.array([])
    });
    this.fetchpaymodel();
    this.fetchPackageModels();
    this.fetchProductModels();
    // this.fetchTruckLoadTypes(consignor_id);
    this.addRow();
    
    
  }
  
  get lraddrow(): FormArray {
    return this.lraddrowForm.get('lraddrow') as FormArray;
  }
 //correct code
  // addRow():void {
  //   const newItem = {

  //     invoicegrossval:'',
      
  //   };
  //   this.items.push(newItem);
  
  // }
  
  // deleteRow(index: number,item:any) {
  //   this.items.splice(index, 1);
  //   this.updateTotalPkgsNo();
  // } 
  // updateTotalPkgsNo() {
  //   this.totalGross = 0; // Reset totalGross before recalculating
  //   for (let i = 0; i < this.items.length; i++) {
  //     const inputElement = document.getElementById('Invoicegrossval' + i) as HTMLInputElement;
  //     const invoicegrossval = inputElement.value;
  //     console.log('Invoicegrossval:', invoicegrossval); // Log the value of Invoicegrossval
  //     if (invoicegrossval) {
  //       this.totalGross += parseFloat(invoicegrossval);
  //     }
  //   }
  //   console.log('Total Gross:', this.totalGross); // Log the totalGross after calculation
  // }
  //end

  addRow(): void {
  // Create a new row with default values
  const newItem = {
    invoicegrossval: '',
    // Add other fields with default values as needed
  };
  this.items.push(newItem);
}

deleteRow(index: number, item: any) {
  const invoicegrossval = item.invoicegrossval;
  if (invoicegrossval) {
    this.totalGross -= parseFloat(invoicegrossval); // Deduct the value from totalGross
  }
  this.items.splice(index, 1); // Remove the row from the items array
  this.updateTotalPkgsNo(); // Recalculate the totalGross
}

// updateTotalPkgsNo() {
//   this.totalGross = 0; // Reset totalGross before recalculating
//   for (let i = 0; i < this.items.length; i++) {
//     const inputElement = document.getElementById('Invoicegrossval' + i) as HTMLInputElement;
//     const invoicegrossval = inputElement.value;
//     console.log('Invoicegrossval:', invoicegrossval); // Log the value of Invoicegrossval
//     if (invoicegrossval) {
//       this.totalGross += parseFloat(invoicegrossval);
//     }
//   }
//   console.log('Total Gross:', this.totalGross); // Log the totalGross after calculation
// }


updateTotalPkgsNo() {
  // Fetch the value of Invoicenoofpkg from the input field
  const InvoicenoofpkgInput = document.getElementById("invgrossnoofpkg") as HTMLInputElement;
  const Invoicenoofpkg = InvoicenoofpkgInput.value;

  // Assuming contractId is already defined and has a value
  const contractId = this.contractId;

  // Log the values before making the API call
  console.log('Invoicenoofpkg:', Invoicenoofpkg);
  console.log('Contract ID:', contractId);
 
  // Call service method with dynamic values
  this.lrService.searchContractsalbrate(contractId, Invoicenoofpkg).subscribe(
    (data: any) => {
      // Handle API response data here
      console.log(data); // Log the API response data
      
      // Assuming data contains slabRate value
      const slabRate = data.slabRate;

      // Update input box with slabRate value
      const frtrateInput = document.getElementById("frtrate") as HTMLInputElement;
      frtrateInput.value = slabRate.toString(); // Assuming slabRate is a number

      // If slabRate is not a number but a string, remove .toString()

    },
    (error: any) => {
      console.error('Error fetching data:', error);
      // Handle errors here
    }
  );
}


// updateTotalPkgsNo() {
//   this.totalGross = 0; // Reset totalGross before recalculating

//   // Fetch the value of Invoicenoofpkg from the input field
//   const InvoicenoofpkgInput = document.getElementById("invgrossnoofpkg") as HTMLInputElement;

//   const Invoicenoofpkg = InvoicenoofpkgInput.value;

//   // Assuming contractId is already defined and has a value
//   const contractId = this.contractId;

//   // Log the values before making the API call
//   console.log('Invoicenoofpkg:', Invoicenoofpkg);
//   console.log(' :', contractId);

//   // Call service method with dynamic values
//   this.lrService.searchContractsalbrate(contractId , Invoicenoofpkg).subscribe(
//     (data: any) => {
//       // Handle API response data here
//       console.log(data); // Log the API response data
      
//       // Assuming data contains totalGross value
//       this.totalGross = data.totalGross; // Update totalGross based on API response
//     },
//     (error: any) => {
//       console.error('Error fetching data:', error);
//       // Handle errors here
//     }
//   );
// }



// Assume this method is in your service



addRow1(): void {
  // Create a new row with default values
  const newItem = {
    Invoicenoofpkg: '',
    // Add other fields with default values as needed
  };
  this.items.push(newItem);
}

deleteRow1(index: number, item: any) {
  const Invoicenoofpkg = item.Invoicenoofpkg;
  if (Invoicenoofpkg) {
    this.totalnoofpkg -= parseFloat(Invoicenoofpkg); // Deduct the value from totalGross
  }
  this.items.splice(index, 1); // Remove the row from the items array
  this.updateTotalPkgsNo(); // Recalculate the totalGross
}

updateTotalnoofpkg() {
  this.totalnoofpkg = 0; // Reset totalnoofpkg before recalculating
  for (let i = 0; i < this.items.length; i++) {
    const inputElement = document.getElementById('Invoicenoofpkg' + i) as HTMLInputElement;
    const Invoicenoofpkg = inputElement.value;
    console.log('Invoicenoofpkg:', Invoicenoofpkg); // Log the value of Invoicenoofpkg
    if (Invoicenoofpkg) {
      this.totalnoofpkg += parseFloat(Invoicenoofpkg);
    }
  }
  console.log('Total No of Pkgs:', this.totalnoofpkg); // Log the totalnoofpkg after calculation
}
addRow2(): void {
  // Create a new row with default values
  const newItem = {
    Invoiceperpkg: '',
    // Add other fields with default values as needed
  };
  this.items.push(newItem);
}

deleteRow2(index: number, item: any) {
  const Invoiceperpkg = item.Invoiceperpkg;
  if (Invoiceperpkg) {
    this.totalperpkg -= parseFloat(Invoiceperpkg); // Deduct the value from totalGross
  }
  this.items.splice(index, 1); // Remove the row from the items array
  this.updateTotalPkgsNo(); // Recalculate the totalGross
}

updateTotalperpkg() {
  this.totalperpkg = 0; // Reset totalGross before recalculating
  for (let i = 0; i < this.items.length; i++) {
    const inputElement = document.getElementById('Invoiceperpkg' + i) as HTMLInputElement;
    const Invoiceperpkg = inputElement.value;
    console.log('Invoiceperpkg:', Invoiceperpkg); // Log the value of Invoicegrossval
    if (Invoiceperpkg) {
      this.totalperpkg += parseFloat(Invoiceperpkg);
    }
  }
  console.log('Total Gross:', this.totalperpkg);
  console.log('contractid:', this.contractId);
}

invoicegrosvalue(){
  // Get the input element by its id
  const inputElement = document.getElementById('invgrossnoofpkg') as HTMLInputElement;
  
 
    console.log('Input element not found',inputElement);
  
}

  
  addrowlr(): FormGroup {
    return this.fb.group({
      Invoiceno: ["", Validators.required],
      Invoicedate: ["", Validators.required],
      Invoicegrossval: ["", Validators.required],
      
      akcwtperpkg: ["", Validators.required],
      akcwt: ["", Validators.required],
      exeesrate: ["", Validators.required],
    });
  }

 

  
  PaidTypeOptions: any[] = [
    { label: "Cash", value: "Cash" },
    { label: "Bank", value: "Bank" },
    { label: "Balance", value: "Balance" },
  ];
  
  RateTypeOptions: any[] = [
    { label: "PER_PKG", value: "PER_PKG" },
    { label: "PER_KG", value: "PER_KG" },
   
  ];
  // serviceTypeOptions: any[] = [
  //   { label: "LTL", value: "LTL" },
  //   { label: "FTL", value: "FTL" },
    
  // ];
  ModeOfTransport: any[] = [
    { label: "Regular", value: "Regular" },
    { label: "Urgent", value: "Urgent" },
  ];
  // servicePickupdelivery: any[] = [
  //   {
  //     label: "Door Pickup - Door Delivery",
  //     value: "Door Pickup - Door Delivery",
  //   },
  //   {
  //     label: "Door Pickup - Godown Delivery",
  //     value: "Door Pickup - Godown Delivery",
  //   },
  //   {
  //     label: "Godown Pickup - Door Delivery",
  //     value: "Godown Pickup - Door Delivery",
  //   },
  //   {
  //     label: "Godown Pickup - Godown Delivery",
  //     value: "Godown Pickup - Godown Delivery",
  //   },
  // ];

  statusOptions = [
    // { label: "NONE", value: null }, // Allows deselection by setting the value to null
    { label: "ACTIVE", value: "ACTIVE" },
    // { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  private loadLrData(id: number): void {
    this.lrService.getLrById(id).subscribe(
      (lr: Lr) => this.lrForm.patchValue(lr),
      (error) => this.handleError(error)
    );
  }
  lrNumber: string = '';
  onSubmit() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to create this LR?',
      accept: () => {
        const lrData = this.lrForm.value;
        lrData["from_place"] = lrData["from_place"]["label"];
        lrData["consignor_id"] = lrData["consignor_id"]["label"];       
        lrData["to_place"] = lrData["to_place"]["label"];
       
        console.log(lrData);
        const lrUrl = this.LrService.getLrUrl();
        this.http.post<any>(lrUrl, lrData).subscribe(
          response => {
            const customLrNum = response.lr.id;
            this.lrNumber = customLrNum;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `LR created successfully. LR Number: ${customLrNum}` });
            this.visible = true;
            setTimeout(() => {
            // Show the dialog after success message
              this.router.navigate(['/fb/lr/create/viewlrnumber'], { queryParams: { customLrNum: customLrNum } });
            }, 4000);
          },
          (error: HttpErrorResponse) => {
            console.error('Failed to create LR:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create LR' });
          }
        );
      },
      reject: () => {
      }
    });
  }
  
  visible: boolean = false;

    showDialog() {
        this.visible = true;
    }
    payment_type:any;
    formGroup:any
    // onPayTypeChange(event: any) {
    //   this.selectedPayType = event.value;
    //   console.log("Pay Type:", this.selectedPayType);
    //   this.formGroup.reset();
    // }
    onPayTypeChange(event: any) {
      // Store the selected value before resetting the form
      const previousPayType = this.selectedPayType;
      
      // Reset the lrForm FormGroup
      this.lrForm.reset();
      
      // Assign back the previousPayType to selectedPayType
      this.selectedPayType = previousPayType;
      
      // Update selectedPayType with the new selected value
      this.selectedPayType = event.value;
      console.log("Pay Type:", this.selectedPayType);
    }
  
    search(event: any, paytype: string) {
      this.lrService.searchCustomers(event.query, paytype).subscribe((response: any[]) => {
        this.suggestions = response.map((item) => ({
          label: `${item.sap_cust_code}: ${item.CustName}`,
          value: item.sap_cust_code,
        }));
        console.log(this.suggestions);
      });
    }selectedPayType: string= "";
    
    selectedConsignorValue: string = '';
    onContractPartySelectfromMaster(selectedParty: any) {
      
      this.selectedConsignorValue = selectedParty.value.label; 
  }

    // contractidname(event: any){

    // }

    
    // search(event: any, paytype: string) {
    //   this.lrService.searchCustomers(event.query, paytype).subscribe((response: any[]) => {
    //     this.suggestions = response.map((item) => ({
    //       label: `${item.sap_cust_code}`,
    //       value: item.sap_cust_code,
    //     }));
    //     console.log(this.suggestions);
    //   });
    // }selectedPayType: string= "";

 
    // searchcon(event: any, consignor_id: string) {
    //   this.lrService.searchContracts(event.query, consignor_id).subscribe((response: any[]) => {
    //     this.suggestions = response.map((item) => ({
    //       label: `${item.sap_cust_code}`,
    //       value: item.sap_cust_code,
    //     }));
    //     console.log(this.suggestions);
    //   });
    // }
    onContractPartySelect(selectedParty: any) {
      const consignorId = selectedParty.value.value; // Extracting value from the selected party
      console.log("consignorId", consignorId);
    
      if (this.selectedPayType === 'TBB' && consignorId) {
        this.fetchTruckLoadTypes(consignorId);
     
          this.fetchPickupDel(consignorId);


          // this.fetchratetype(consignorId);
    
        } else {
          // If the selected pay type is not 'TBB', manually populate the dropdown options
          this.manuallyPopulateDropdownOptions();
        }
    
    }
    fetchTruckLoadTypes(consignorId: string) {
      this.lrService.selectCont(consignorId).subscribe((response: any) => {
        if (response && response.load_type) {
          // Extract contract_id from the response
          this.contractId = response.contract_id;
  
          // Use load_type directly for dropdown options
          const loadTypes = response.load_type.split(',').map((value: string) => ({ label: value.trim(), value: value.trim() }));
          this.truck_load_typeOptions = loadTypes;
          console.log('Valid response format:', this.truck_load_typeOptions);
        } else {
          console.error('Invalid response format:', response);
        }
      });
    }


    fetchPickupDel(consignorId: string) {
      this.lrService.fetchPickDel(consignorId).subscribe((response: any) => {
        if (typeof response === 'string') {
          // Split the string by comma and trim the values
          const valuesArray = response.split(',').map(value => value.trim());
          
          // Map the array of values to the desired format for dropdown options
          this.pickup_del_typeOptions = valuesArray.map(value => ({ label: value, value: value }));
          console.log('Valid response pick del:', this.pickup_del_typeOptions);
        } else {
          console.error('Invalid response format:', response);
        }
      });
    }
    // fetchratetype(consignorId: string) {
    //   this.lrService.fetchratetype(consignorId).subscribe((response: any) => {
    //     if (typeof response === 'string') {
    //       // Split the string by comma and trim the values
    //       const valuesArray = response.split(',').map(value => value.trim());
          
    //       // Map the array of values to the desired format for dropdown options
    //       this.RateTypeOptions = valuesArray.map(value => ({ label: value, value: value }));
    //       console.log('Valid response pick del:', this.RateTypeOptions);
    //     } else {
    //       console.error('Invalid response format:', response);
    //     }
    //   });
    // }
  
    ontruck_load_typeChange(event: any) {
      this.selectedTruckLoadType = event.value; // Update selected truck load type
    }
    
    onpickup_del_typeChange(event: any) {
      this.selectedTruckLoadType = event.value; // Update selected truck load type
    }
    onratetypeChange(event: any) {
      this.selectedTruckLoadType = event.value; // Update selected truck load type
    }
   
    manuallyPopulateDropdownOptions() {
      // Manually populate the dropdown options for both truck load and pickup-del
    
      // Manually populate truck load type options
      this.truck_load_typeOptions = [
        { label: 'LTL', value: 'LTL' },
        { label: 'FTL', value: 'FTL' },
        // Add more options as needed
      ];
    
      // Manually populate pickup-del options
      this.pickup_del_typeOptions = [
        { label: 'DPTODD', value: 'DPTODD' },
        { label: 'DDGP', value: 'DDGP' },
        // Add more options as needed
      ];
    }

  


  searchcity(event: any) {
    this.lrService.searchfromCity(event.query).subscribe((response: any[]) => {
      this.suggestions = response.map((item) => ({
        label: `${item.CityNameEng}`,
        value: item.CityNameEng,
      }));
      console.log(this.suggestions);
    }); 
  }
  searchtocity(event: any) {
    this.lrService.searchfromCity(event.query).subscribe((response: any[]) => {
      this.suggestions = response.map((item) => ({
        label: `${item.CityNameEng}`,
        value: item.CityNameEng,
      }));
      console.log(this.suggestions);
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private handleSuccess(message: string, lr: Lr | null): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedLr = lr;
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
    this.router.navigate(["/fb/lr"]);
    this.lrForm.reset(); // Reset the form when canceling the operation
  }

  resetFormAndNavigateBack(): void {
    this.lrForm.reset();
    this.router.navigate(["/fb/lr"]);
  }
  fetchpaymodel() {
    this.lrService.getpaymodel().subscribe(
      (response: any) => {
        console.log("Response:", response); // Log the response to see its structure
        if (Array.isArray(response)) {
          this.PayTypeOptions = response.map((item: string) => ({
            label: item,
            value: item,
          }));
        } else if (response && Array.isArray(response.paymodel)) {
          this.PayTypeOptions = response.paymodel.map((item: string) => ({
            label: item,
            value: item,
          }));
        } else {
          console.error("Invalid response format:", response);
        }
      },  
      (error) => {
        console.error("Error fetching pay types:", error);
      }
    );
  }
  fetchPackageModels() {
    this.lrService.getpackagingmodel().subscribe(
      (response: any) => {
        console.log("Response:", response); // Log the response to see its structure
        if (response && Array.isArray(response.packageModels)) { // Accessing packageModels array directly
          this.PackageTypeOptions = response.packageModels.map((item: string) => ({
            label: item,
            value: item,
          }));
        } else {
          console.error("Invalid response format:", response);
        }
      },
      (error) => {
        console.error("Error fetching packaging types:", error);
      }
    );
  }

  fetchProductModels() {
    this.lrService.getproductmodel().subscribe(
      (response: any) => {
        console.log("Response:", response); // Log the response to see its structure
        if (response && Array.isArray(response.productModels)) { // Accessing packageModels array directly
          this.ProductTypeOptions = response.productModels.map((item: string) => ({
            label: item,
            value: item,
          }));
        } else {
          console.error("Invalid response format:", response);
        }
      },
      (error) => {
        console.error("Error fetching packaging types:", error);
      }
    );
  }
  fetchcontractModels() {
    this.lrService.getcontractmodel().subscribe(
      (response: any) => {
        console.log("Response:", response); // Log the response to see its structure
        if (response && Array.isArray(response.lrcontractModels)) { // Accessing packageModels array directly
          this.ProductTypeOptions = response.lrcontractModels.map((item: string) => ({
            label: item,
            value: item,
          }));
        } else {
          console.error("Invalid response format:", response);
        }
      },
      (error) => {
        console.error("Error fetching packaging types:", error);
      }
    );
  }
  
}  
