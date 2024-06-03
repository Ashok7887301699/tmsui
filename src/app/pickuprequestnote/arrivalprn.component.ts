import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { PickuprequestnoteService } from "./services/pickuprequestnote.service";
import { PickupRequestNote } from "./models/pickuprequestnote.model";
import { FormControl } from "@angular/forms"; // Add this import
import { DialogService } from "primeng/dynamicdialog"; // Import DialogService from PrimeNG

@Component({
  selector: "app-arrivalprn",
  templateUrl: "./arrivalprn.component.html",
})
export class ArrivalprnComponent implements OnInit {
  pickuprequestnotearrivalForm: FormGroup; // Rename to pickuprequestnoteForm
  isEditMode = false;
  pickuprequestnoteId: number | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = [];
  currentStep = 0; // Track the current step
  operationSuccessful = false; // Flag to track operation success
  createdOrEditedPRN: PickupRequestNote | null = null; // Store the tenant data after successful operation
  errorMessage = ""; // Store error message
  searchResults: any[] = []; // Declare searchResults property

  constructor(
    private fb: FormBuilder,
    private pickuprequestnoteService: PickuprequestnoteService, // Rename to pickuprequestnoteService
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.pickuprequestnotearrivalForm = this.fb.group({
      FromDate: [null, Validators.required],
      ToDate: [null, Validators.required],
      prnno: [null, Validators.required], // Add prnno control

      option: ["Option1"], // Default selection
    });

    // Initialize the steps
    this.steps = [{ label: "ARIVAL Details" }, { label: "Next Step" }];
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
  }

  private loadPRNData = (id: number): void => {
    this.pickuprequestnoteService.getPRNById(id).subscribe(
      (prn) => this.pickuprequestnotearrivalForm.patchValue(prn),
      (error) => this.handleError(error)
    );
  };

  search(): void {
    const prnData = this.pickuprequestnotearrivalForm.value;

    if (prnData.option === "bydate") {
      // Run API call for search by date
      this.pickuprequestnoteService
        .searchByDate(prnData.FromDate, prnData.ToDate)
        .subscribe(
          (result) => {
            // Check if result is an array
            if (Array.isArray(result)) {
              // Assign the API response to searchResults
              this.searchResults = result;
              console.log("Search by date result:", result);
            } else {
              // Convert the single object response to an array
              this.searchResults = [result];
              console.log("Search by date result:", [result]);
            }
          },
          (error) => {
            console.error("Search by date error:", error);
          }
        );
    } else if (prnData.option === "byprn") {
      // Run API call for search by PRN
      this.pickuprequestnoteService.searchByPRN(prnData.prnno).subscribe(
        (result) => {
          // Assign the API response to searchResults
          this.searchResults = [result]; // Assuming searchByPRN returns a single result
          console.log("Search by PRN result:", result);
        },
        (error) => {
          console.error("Search by PRN error:", error);
        }
      );
    } else {
      // Handle invalid option
      console.error("Invalid search option:", prnData.option);
    }
  }
  updatestockarrivalprn(prnId: string): void {
    const encodedPrnId = encodeURIComponent(prnId); // Encode the prnId
    this.router.navigate([`/fm/prn/updatestockarrivalprn/${encodedPrnId}`]);
  }

  private handleSuccess(message: string, prn: PickupRequestNote | null): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedPRN = prn;
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
  cancel(): void {
    this.router.navigate(["/fm/prn"]);
  }

  resetFormAndNavigateBack(): void {
    this.pickuprequestnotearrivalForm.reset();
    this.router.navigate(["/fm/prn"]);
  }
}
