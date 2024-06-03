import { Component, OnInit, Output , EventEmitter,Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuItem, MessageService } from "primeng/api";
// import { ContractService } from "./services/contract.service";
import { Contract } from "./models/contract.model";
import { ConfigService } from "../core/config/config.service";
import { HttpClient } from '@angular/common/http';
// definationUrl

@Component({
  selector: "app-Slabdefination",
  templateUrl: "./contractslabdefinitions.component.html",
})
export class contractslabdefinitionsComponent {
  @Output() slabdefinationsucess: EventEmitter<void> = new EventEmitter<void>();
  @Input() contract: Contract | null = null;
steps: MenuItem[]|undefined;
 
resetFormAndNavigateBack() {
throw new Error('Method not implemented.');
}


    cancel() {
        this.router.navigate(["/md/depot"]);
      }
      isEditMode: boolean = false;
      depotCode: string | null = null;
      messages: any[] = []; // Define messages array
      currentStep: number = 0; // Track the current step
      operationSuccessful: boolean = false; // Flag to track operation success
      errorMessage: string = ""; // Store error message
      definationUrl: string;
      formData: any = {};
      createdOrEditedDepot: any;

      myForm: any;
      slabs = ['slab1', 'slab2', 'slab3', 'slab4', 'slab5', 'slab6', 'slab7', 'slab8'];
      constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private configService: ConfigService,
        private http: HttpClient
      ) {
        this.definationUrl = this.configService.apiUrl + '/Contract/defination';
      }
      slab_rate_type = [
        { label: "RATED", value: "RATED" },
        { label: "FLAT", value: "FLAT" },
        
      ];

      slab_contract_type = [
        { label: "PER_PKG", value: "PER_PKG" },
        { label: "PER_KG", value: "PER_KG" },
        
      ];
      

      ngOnInit(): void {
        this.myForm = this.formBuilder.group({});
    
        for (let index = 0; index < this.slabs.length; index++) {
            this.myForm.addControl('slab_number' + index, this.formBuilder.control('')); // Remove value binding
            this.myForm.addControl('slab_lower_limit' + index, this.formBuilder.control(''));
            this.myForm.addControl('slab_upper_limit' + index, this.formBuilder.control(''));
            this.myForm.addControl('slab_rate_type' + index, this.formBuilder.control(''));
            this.myForm.addControl('slab_contract_type' + index, this.formBuilder.control(''));

        }
    }
    
    

    
    onSubmit(): void {
      const contractId = this.contract?.contract_id ?? 0;
        const formDataWithContractId = {
          ...this.myForm.value,
          contract_id: contractId
      };
  
      // Filter out empty values
      const filteredData: any = {};
      Object.keys(formDataWithContractId).forEach(key => {
          const value = formDataWithContractId[key];
          if (value !== null && value !== undefined && value !== '') {
              filteredData[key] = value;
          }
      });
  
      console.log('Filtered Form data:', filteredData);
  
      this.http.post(this.definationUrl, filteredData).subscribe(
          (response: any) => {
              this.handleSuccess("Data inserted successfully", response);
              console.log(filteredData);
          },
          (error: any) => {
              console.error("Insertion failed:", error);
              this.handleError(error);
          }
      );
  }
  
      
      

      handleSuccess(message: string, contract: any): void {
        console.log(message);
        console.log("Contract details:", contract);
        this.operationSuccessful = true;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
        this.slabdefinationsucess.emit();
      }
    
      handleError(error: any): void {
        console.error("An error occurred:", error);
        this.operationSuccessful = false;
      }
      
      initForm(): void {
        this.myForm = this.formBuilder.group({
          slab_definitions: this.formBuilder.array([]),
        });
      }
     
    }
    