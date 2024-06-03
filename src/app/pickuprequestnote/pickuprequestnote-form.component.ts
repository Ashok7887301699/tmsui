import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { PickuprequestnoteService } from "./services/pickuprequestnote.service";
import { PickupRequestNote } from "./models/pickuprequestnote.model";
import { FormControl } from "@angular/forms"; // Add this import
import { DialogService } from "primeng/dynamicdialog"; // Import DialogService from PrimeNG

@Component({
  selector: "app-pickuprequestnote-form",
  templateUrl: "./pickuprequestnote-form.component.html",
})
export class PickuprequestnoteFormComponent implements OnInit {
  suggestions: any[] = [];
  checked: boolean[] = [];
  prnNumber: string = ""; // PRN number

  //checked: boolean = false; // Declare suggestions property
  cancel = () => {
    this.router.navigate(["/fm/prn"]);
  };
  pickuprequestnoteForm: FormGroup; // Rename to pickuprequestnoteForm
  isEditMode = false;
  pickuprequestnoteId: number | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = [];
  hamalivendornameOptions: any[] = []; // Define messages array
  // Define messages array
  currentStep = 0; // Track the current step
  operationSuccessful = false; // Flag to track operation success
  createdOrEditedPRN: PickupRequestNote | null = null; // Store the tenant data after successful operation
  errorMessage = ""; // Store error message
  // Explicitly type as FormControl<boolean>
  lrCheckboxes: FormControl<boolean | null>[] = [];

  //lrNumbers: string[][] = [];
  lrNumbers: { id: string; num_of_pkgs: number }[] = [];

  constructor(
    private fb: FormBuilder,
    private pickuprequestnoteService: PickuprequestnoteService, // Rename to pickuprequestnoteService
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.pickuprequestnoteForm = this.fb.group({
      FromDate: [null, Validators.required],
      ToDate: [null, Validators.required],
      contact_person_name: [null, Validators.required],

      vehicle_num: [null, Validators.required],
      loader_vendor_id: [null],
      total_labour_charges: [null],
      // Add other form controls as needed
    });

    // Initialize the steps
    this.steps = [{ label: "PRN Details" }, { label: "Next Step" }];
  }

  ngOnInit(): void {
    // Subscribe to route parameters to determine if in edit mode
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.pickuprequestnoteId = params["id"];
        if (this.pickuprequestnoteId !== null) {
          this.loadPRNData(this.pickuprequestnoteId);
        }
      }
    });
    this.fetchHvendor();
  }

  fetchHvendor() {
    this.pickuprequestnoteService.getHvendor().subscribe(
      (response: any[]) => {
        console.log("Response:", response);
        if (Array.isArray(response)) {
          this.hamalivendornameOptions = response.map((item) => ({
            label: item.Hvendor,
            value: item.id,
          }));
        } else {
          console.error("Invalid response format:", response);
        }
      },
      (error) => {
        console.error("Error fetching vendor data:", error);
      }
    );
  }

  // Dropdown options for hamalivendorname
  // hamalivendornameOptions = [
  //   // { label: "NONE", value: null },
  //   { label: "Ashok", value: "Ashok" },
  //   { label: "Shiv", value: "Shiv" },
  // ];

  // Load PRN data for editing
  private loadPRNData = (id: number): void => {
    this.pickuprequestnoteService.getPRNById(id).subscribe(
      (prn) => this.pickuprequestnoteForm.patchValue(prn),
      (error) => this.handleError(error)
    );
    this.fetchHvendor();
  };

  private addLRNumberCheckboxes(
    lrNumbers: { id: string; num_of_pkgs: number }[]
  ): void {
    this.lrCheckboxes = []; // Clear existing checkboxes
    lrNumbers.forEach(() => {
      const control = new FormControl(false); // Initialize with false
      this.lrCheckboxes.push(control);
    });
  }

  private getSelectedLRNumbers(): { id: string; num_of_pkgs: number }[] {
    const selectedLRNumbers: { id: string; num_of_pkgs: number }[] = [];
    this.lrNumbers.forEach((lr, index) => {
      const checkbox = this.lrCheckboxes[index];
      if (checkbox && checkbox.value === true) {
        selectedLRNumbers.push(lr);
      }
    });
    return selectedLRNumbers;
  }

  onSubmit = (): void => {
    if (this.pickuprequestnoteForm.valid) {
      const prnData = this.pickuprequestnoteForm.value;
      prnData["contact_person_name"] = prnData["contact_person_name"]["label"];
      prnData["vehicle_num"] = prnData["vehicle_num"]["label"];

      const loaderVendorIdControl =
        this.pickuprequestnoteForm.get("loader_vendor_id");
      if (loaderVendorIdControl) {
        prnData["loader_vendor_id"] = loaderVendorIdControl.value;
      }

      const lrData = this.getSelectedLRNumbers();
      prnData["prn_lr_data"] = lrData; // Assign selected LR data directly

      console.log("Form Data:", prnData);

      if (this.isEditMode && this.pickuprequestnoteId) {
        this.pickuprequestnoteService
          .updatePRN(this.pickuprequestnoteId, prnData)
          .subscribe(
            (prn) => {
              this.handleSuccess("PRN updated successfully", prn);
              console.log("Updated PRN:", prn);
            },
            (error) => {
              console.error("Update PRN error:", error);
            }
          );
      } else {
        this.pickuprequestnoteService.createPRN(prnData).subscribe(
          (prn) => {
            this.handleSuccess("PRN created successfully", prn);
            console.log("Created PRN:", prn);
          },
          (error) => {
            console.error("Create PRN error:", error);
          }
        );
      }
    }
  };

  // private addLRNumberCheckboxes(
  //   lrNumbers: { id: string; num_of_pkgs: number }[]
  // ): void {
  //   this.lrCheckboxes = []; // Clear existing checkboxes
  //   lrNumbers.forEach((lr, index) => {
  //     const control = new FormControl(false); // Initialize with false
  //     this.lrCheckboxes.push(control);
  //     console.log(`LR Number ${index + 1}:`, lr.id); // Logging LR Number
  //     console.log(`Package Number ${index + 1}:`, lr.num_of_pkgs); // Logging Package Number
  //   });
  // }

  // private getSelectedLRNumbers(): { id: string; num_of_pkgs: number }[] {
  //   const selectedLRNumbers: { id: string; num_of_pkgs: number }[] = [];
  //   this.lrNumbers.forEach((lr, index) => {
  //     const checkbox = this.lrCheckboxes[index];
  //     if (checkbox && checkbox.value === true) {
  //       selectedLRNumbers.push(lr);
  //     }
  //   });
  //   return selectedLRNumbers;
  // }

  // onSubmit = (): void => {
  //   if (this.pickuprequestnoteForm.valid) {
  //     const prnData = this.pickuprequestnoteForm.value;
  //     prnData["contact_person_name"] = prnData["contact_person_name"]["label"];
  //     prnData["vehicle_num"] = prnData["vehicle_num"]["label"];

  //     const loaderVendorIdControl =
  //       this.pickuprequestnoteForm.get("loader_vendor_id");
  //     if (loaderVendorIdControl) {
  //       prnData["loader_vendor_id"] = loaderVendorIdControl.value;
  //     }

  //     const lrData = this.getSelectedLRNumbers();
  //     // Modify lrData to include both LR numbers and package numbers
  //     prnData["prn_lr_data"] = lrData.map((lr) => ({
  //       lr_id: lr.id, // Use 'lr_id' instead of 'id'
  //       num_of_pkgs: lr.num_of_pkgs, // Use 'num_of_pkgs' instead of 'pkgno'
  //     }));

  //     console.log("Form Data:", prnData);

  //     if (this.isEditMode && this.pickuprequestnoteId) {
  //       this.pickuprequestnoteService
  //         .updatePRN(this.pickuprequestnoteId, prnData)
  //         .subscribe(
  //           (prn) => {
  //             this.handleSuccess("PRN updated successfully", prn);
  //             console.log("Updated PRN:", prn);
  //           },
  //           (error) => {
  //             console.error("Update PRN error:", error);
  //           }
  //         );
  //     } else {
  //       this.pickuprequestnoteService.createPRN(prnData).subscribe(
  //         (prn) => {
  //           this.handleSuccess("PRN created successfully", prn);
  //           console.log("Created PRN:", prn);
  //         },
  //         (error) => {
  //           console.error("Create PRN error:", error);
  //         }
  //       );
  //     }
  //   }
  // };

  search(event: any) {
    this.pickuprequestnoteService
      .searchCustomers(event.query)
      .subscribe((response: any[]) => {
        this.suggestions = response.map((item) => ({
          label: `${item.sap_cust_code}: ${item.CustName}`,
          value: item.sap_cust_code,
        }));
        console.log(this.suggestions);
      });
  }

  searchVehicle(event: any) {
    this.pickuprequestnoteService
      .searchVehicles(event.query) // Use the getvehiclename method
      .subscribe((response: any[]) => {
        this.suggestions = response.map((vehicleNo) => ({
          // Iterate over vehicle numbers
          label: vehicleNo, // Set label as vehicle number
          value: vehicleNo, // Set value as vehicle number
        }));
        console.log(this.suggestions);
      });
  }

  // fetchLRNumbers(event: any) {
  //   const selectedFromDate = this.pickuprequestnoteForm.get("FromDate")?.value;
  //   const selectedToDate = this.pickuprequestnoteForm.get("ToDate")?.value;
  //   const selectedCustomerName =
  //     this.pickuprequestnoteForm.get("customer_id")?.value;

  //   console.log("Selected From Date:", selectedFromDate);
  //   console.log("Selected To Date:", selectedToDate);
  //   console.log("Selected Customer Name:", selectedCustomerName);

  //   this.pickuprequestnoteService
  //     .fetchLRNumbers(selectedFromDate, selectedToDate, selectedCustomerName)
  //     .subscribe((lrNumbers: string[][]) => {
  //       console.log(lrNumbers);
  //       this.lrNumbers = lrNumbers; // Assign fetched LR numbers to the array
  //       this.addLRNumberCheckboxes(lrNumbers); // Add checkboxes
  //     });
  // }

  fetchLRNumbers(event: any) {
    const selectedFromDate = this.pickuprequestnoteForm.get("FromDate")?.value;
    const selectedToDate = this.pickuprequestnoteForm.get("ToDate")?.value;
    const selectedCustomerName =
      this.pickuprequestnoteForm.get("customer_id")?.value;

    console.log("Selected From Date:", selectedFromDate);
    console.log("Selected To Date:", selectedToDate);
    console.log("Selected Customer Name:", selectedCustomerName);

    this.pickuprequestnoteService
      .fetchLRNumbers(selectedFromDate, selectedToDate, selectedCustomerName)
      .subscribe(
        (lrNumbers: any[]) => {
          console.log(lrNumbers); // Check the received data

          this.lrNumbers = lrNumbers; // Assign fetched LR numbers to the array
          this.addLRNumberCheckboxes(lrNumbers); // Add checkboxes
        },
        (error) => {
          console.error("Error fetching LR numbers:", error);
        }
      );
  }

  private handleSuccess(message: string, prn: PickupRequestNote | null): void {
    this.createdOrEditedPRN = prn;
    this.messages = [
      {
        severity: "success",
        summary: "Success",
        detail:
          message +
          (this.createdOrEditedPRN
            ? JSON.stringify(this.createdOrEditedPRN)
            : ""), // Display PRN details if available
      },
    ];
    this.operationSuccessful = true;
    this.currentStep = 1; // Move to step 2 to show PRN details
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

  // Navigate back to the PRN list
  resetFormAndNavigateBack(): void {
    this.pickuprequestnoteForm.reset();
    this.router.navigate(["/fm/prn"]);
  }
}
