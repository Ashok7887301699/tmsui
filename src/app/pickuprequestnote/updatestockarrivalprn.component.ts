import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { PickuprequestnoteService } from "./services/pickuprequestnote.service";
import { PickupRequestNote } from "./models/pickuprequestnote.model";

@Component({
  selector: "app-updatestockarrivalprn",
  templateUrl: "./updatestockarrivalprn.component.html",
})
export class UpdatestockarrivalprnComponent implements OnInit {
  pickupRequestNote: PickupRequestNote = {};
  pickupRequestDetails: any[] = [];
  pickuprequestnoteupdatearrivalForm: FormGroup;
  hamalivendornameOptions: any[] = [];
  currentStep = 0;
  messages: any[] = [];
  operationSuccessful = false;
  errorMessage = "";
  isEditMode = false;
  steps: any[]; // Define the steps for the stepper

  resonOptions = [
    { label: "OK", value: "OK" },
    { label: "MissmatchQty", value: "MissmatchQty" },
    { label: "Leakage", value: "Leakage" },
    { label: "Damage", value: "Damage" },
    { label: "Extra", value: "Extra" },
  ];

  constructor(
    private fb: FormBuilder,
    private pickuprequestnoteService: PickuprequestnoteService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.pickuprequestnoteupdatearrivalForm = this.fb.group({
      arrivalhamalivendorname: ["", Validators.required],
      arrivalhamalivendoramount: ["", Validators.required],
      recievedqty: ["", Validators.required],
      reason: ["", Validators.required],

      option: ["Option1"],
    });
    this.steps = [{ label: "PRN Details" }, { label: "Next Step" }];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const encodedPrnId = params["prnId"];
      if (encodedPrnId) {
        const prnId = decodeURIComponent(encodedPrnId);
        this.loadPRNData(prnId);
      }
    });
    this.fetchHvendor();
  }

  loadPRNData(prnId: string): void {
    this.pickuprequestnoteService.FetchByPRN(prnId).subscribe(
      (result) => {
        if (result.pickupRequestNotes.length > 0) {
          this.pickupRequestNote = result.pickupRequestNotes[0];
        }
        this.pickupRequestDetails = result.pickupRequestDetails;
      },
      (error) => {
        console.error("Search by PRN error:", error);
        this.errorMessage = "Error fetching PRN data";
      }
    );
  }

  fetchHvendor() {
    this.pickuprequestnoteService.getHvendor().subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.hamalivendornameOptions = response.map((item: string) => ({
            label: item,
            value: item,
          }));
        } else if (response && Array.isArray(response.name)) {
          this.hamalivendornameOptions = response.name.map((item: string) => ({
            label: item,
            value: item,
          }));
        } else {
          console.error("Invalid response format:", response);
        }
      },
      (error) => {
        console.error("Error fetching vendor:", error);
      }
    );
  }

  toggleFields() {
    const option = this.pickuprequestnoteupdatearrivalForm.get("option")?.value;
    if (option === "withoutunloading") {
      this.pickuprequestnoteupdatearrivalForm
        .get("hamalivendorname")
        ?.disable();
      this.pickuprequestnoteupdatearrivalForm
        .get("hamalivendoramount")
        ?.disable();
    } else {
      this.pickuprequestnoteupdatearrivalForm.get("hamalivendorname")?.enable();
      this.pickuprequestnoteupdatearrivalForm
        .get("hamalivendoramount")
        ?.enable();
    }
  }

  isWithoutUnloadingSelected(): boolean {
    const option = this.pickuprequestnoteupdatearrivalForm.get("option")?.value;
    return option === "withoutunloading";
  }

  onSubmit(): void {
    if (this.pickuprequestnoteupdatearrivalForm.valid) {
      const prnData = this.pickuprequestnoteupdatearrivalForm.value;

      if (this.isEditMode && this.pickupRequestNote.id) {
        // Convert pickupRequestNote.id to number if necessary
        const id = parseInt(this.pickupRequestNote.id, 10);
        if (isNaN(id)) {
          console.error("Invalid PRN ID:", this.pickupRequestNote.id);
          return;
        }

        this.pickuprequestnoteService.updatePRN(id, prnData).subscribe(
          (prn) => {
            this.handleSuccess("PRN updated successfully", prn);
          },
          (error) => {
            console.error("Update PRN error:", error);
            this.handleError(error);
          }
        );
      } else {
        this.pickuprequestnoteService.createPRN(prnData).subscribe(
          (prn) => {
            this.handleSuccess("PRN created successfully", prn);
          },
          (error) => {
            console.error("Create PRN error:", error);
            this.handleError(error);
          }
        );
      }
    }
  }

  private handleSuccess(message: string, prn: PickupRequestNote | null): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
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
  }

  // Navigate back to the PRN list
  cancel(): void {
    this.router.navigate(["/fm/prn"]);
  }

  resetFormAndNavigateBack(): void {
    this.pickuprequestnoteupdatearrivalForm.reset();
    this.router.navigate(["/fm/prn"]);
  }
}
