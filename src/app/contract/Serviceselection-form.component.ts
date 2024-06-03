import { Component, Input, OnInit, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Contract } from "./models/contract.model";
import { ContractService } from "./services/contract.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
@Component({
  selector: "app-Serviceselection",
  templateUrl: "./Serviceselection-form.component.html",
})
export class Serviceselection implements OnInit {
  @Input() contract: Contract | null = null;
  isEditMode: boolean = false;
  ServiceForm!: FormGroup;
  currentStep: number = 1;
  isChecked: boolean = false;
  messages: any[] = [];
  operationSuccessful: boolean = false;
  errorMessage: string = ""; // Declare errorMessage variable
  contract_id: number | null = null;
  createdOrEditedservice: any;

  @Output() serviceSelectionSuccess: EventEmitter<void> = new EventEmitter<void>();
  constructor(private formBuilder: FormBuilder, private contractService: ContractService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.contract_id = params["id"];
        if (this.contract_id !== null) {
          this.loadContractData(this.contract_id);
        }
      }
    });
    this.ServiceForm = this.formBuilder.group({
      ftl: [false],
      ltl: [false],
      flat: [false],
      perpkg: [false],
      quintal: [false], 
      perkg: new FormControl(false),
      slabRange: [false],
      Matrices: [false],
      gpgd: [false],
      gpdd: [false],
      dpgd: [false],
      dpdd: [false],
      document: new FormControl,
      excess: [false],
      door: [false],
      insurance: new FormControl,
      minimum_excess: new FormControl,
    });
  }
  private loadContractData(contract_id: number): void {
    this.contractService.geServiceById(contract_id).subscribe(
      (service) => {
        console.log("Contract data received:", service);
        this.ServiceForm.patchValue({
          ftl: service.load_type,
          ltl: service.load_type, // Set to true if load_type is 'ltl', otherwise false
          flat: service.flat,
          perpkg: service.perpkg,
          quintal: service.quintal,
          perkg: service.perkg,
          slabRange: service.slabRange,
          Matrices: service.Matrices,
          gpgd: service.gpgd,
          gpdd: service.gpdd,
          dpgd: service.dpgd,
          dpdd: service.dpdd,
          excess: service.excess_weight_chargeable,
          door: service.door_delivery_chargeable,
          document: service.doc_charges,
          insurance: service.insurance_chargeable,
        });
      },
      (error) => {
        console.error("Error loading contract data:", error);
        this.handleError(error);
      }
    );
  }
  
  
 onSubmit(): void {
  if (this.ServiceForm.valid) {
    const formData = this.ServiceForm.value;
    const load_type = this.getSelectedValues(formData, ['ftl', 'ltl']);
    const rate_type = this.getSelectedValues(formData, ['flat', 'perpkg', 'quintal', 'perkg']);
    const slab_contract_type = formData.slabRange;
    const matrices_type = formData.Matrices;
    const pickup_delivery_mode = this.getSelectedValues(formData, ['gpgd', 'gpdd', 'dpgd', 'dpdd']);
    const doc_charges = formData.document ? formData.document : 0;
    const excess_weight_chargeable = formData.excess ? 1 : 0; // Convert to 1 if checked, otherwise 0
    const door_delivery_chargeable = formData.door ? 1 : 0; // Convert to 1 if checked, otherwise 0
    const insurance_chargeable = formData.insurance ? formData.insurance : 0;
    const minimum_excess = formData.minimum_excess ? formData.minimum_excess : 0;
    const servicedata = {
      contract_id: this.contract?.contract_id ?? 0,
      load_type: load_type,
      rate_type: rate_type,
      slab_contract_type: slab_contract_type,
      matrices_type: matrices_type,
      pickup_delivery_mode: pickup_delivery_mode,
      doc_charges: doc_charges,
      excess_weight_chargeable: excess_weight_chargeable,
      door_delivery_chargeable: door_delivery_chargeable,
      insurance_chargeable: insurance_chargeable,
      minimum_excess: minimum_excess,
    };

    if (this.isEditMode && this.contract_id) {
      const contract_id = this.contract_id;
      console.log(this.contract_id);
      this.contractService.updateService(contract_id, servicedata).subscribe(
        (service) => this.handleSuccess("Service updated successfully",service),
        (error) => this.handleError(error)
      );
    } else {
      this.contractService.createService(servicedata).subscribe(
        (service) => this.handleSuccess("Service created successfully",service),
        (error) => this.handleError(error)
      );
    }
  }
}

private handleSuccess(message: string, contract: any) {
  this.messageService.add({ severity: "success", summary: "Success", detail: message });
  this.messages = [
    { severity: "success", summary: "Success", detail: message },
  ];
  this.createdOrEditedservice = contract; // Assuming you have contract data available
  this.operationSuccessful = true;
  this.serviceSelectionSuccess.emit();
}

  

  private handleError(error: any): void {
    this.errorMessage = "An error occurred";
    this.messages = [
      { severity: "error", summary: "Error", detail: this.errorMessage },
    ];
    this.operationSuccessful = false;
    console.error("An error occurred:", error);
  }
  

  private getSelectedValues(formData: any, keys: string[]): string {
    return keys.filter(key => formData[key]).join(',');
  }

  cancel() {
    // Handle cancellation
  }
}
