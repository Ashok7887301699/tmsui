import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contract } from "./models/contract.model";
import { ContractService } from "./services/contract.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
@Component({
  selector: 'app-ContractExcess',
  templateUrl: './contract-excess.component.html'

})
export class ContractExcess implements OnInit {
  @Input() contract: Contract | null = null;
  Excessform!: FormGroup;
  isEditMode: boolean = false;
  messages: any[] = [];
  operationSuccessful: boolean = false;
  errorMessage: string = '';
  currentStep: number = 2;
  contract_id: number | null = null;
  @Output() serviceexcessSuccess: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private formBuilder: FormBuilder, 
    private contractService: ContractService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService) {}

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
      this.Excessform = this.formBuilder.group({
        rowCount: ['', Validators.required]
      });
    
      this.Excessform.get('rowCount')?.valueChanges.subscribe(value => {
        const rowCount = parseInt(value, 10) || 0;
        const controls = this.Excessform.controls;
    
        for (const key in controls) {
          if (key.startsWith('from') || key.startsWith('to') || key.startsWith('rates')) {
            this.Excessform.removeControl(key);
          }
        }
    
        for (let i = 0; i < rowCount; i++) {
          this.Excessform.addControl(`lower_slab_limit[${i}]`, this.formBuilder.control('', Validators.required));
          this.Excessform.addControl(`upper_slab_limit[${i}]`, this.formBuilder.control('', Validators.required));
          this.Excessform.addControl(`rate[${i}]`, this.formBuilder.control('', Validators.required));
        }
      });
    }
    
  private loadContractData(contract_id: number): void {
    this.contractService.getExcessById(contract_id).subscribe(
      (contract) => this.Excessform.patchValue(contract),
      (error) => this.handleError(error)
    );
  }
  get rowIndexes(): number[] {
    const rowCount = this.Excessform.get('rowCount')?.value;
    return rowCount ? Array.from({ length: rowCount }, (_, index) => index) : [];
  }
  onSubmit(): void {
    if (this.Excessform.valid) {
      const contract_id = this.contract?.contract_id ?? 0; // If contract ID is not available, default to 1
  
      const excessFormData = this.rowIndexes.map(index => ({
        lower_slab_limit: this.Excessform.get(`lower_slab_limit[${index}]`)?.value,
        upper_slab_limit: this.Excessform.get(`upper_slab_limit[${index}]`)?.value,
        rate: this.Excessform.get(`rate[${index}]`)?.value,
        contract_id: contract_id
      }));
  
      console.log('Data to be sent:', excessFormData); // Log the data before sending
  
      this.contractService.createExcess({ data: excessFormData }).subscribe(
        () => this.handleSuccess("Excess records created successfully"),
        (error) => this.handleError(error)
      );
    } else {
      console.error('Form is invalid');
    }
  }
  
  
  
  
  
  private handleSuccess(message: string): void {
    this.messages = [{ severity: "success", summary: "Success", detail: message }];
    this.operationSuccessful = true;
    this.serviceexcessSuccess.emit();
  }

  private handleError(error: any): void {
    this.errorMessage = "An error occurred";
    this.messages = [{ severity: "error", summary: "Error", detail: this.errorMessage }];
    this.operationSuccessful = false;
    console.error("An error occurred:", error);
  }

  onCancel() {
    // Implement cancel functionality here
  }
}