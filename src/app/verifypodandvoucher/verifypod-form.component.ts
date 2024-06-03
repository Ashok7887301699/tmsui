import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { MenuItem, MessageService } from "primeng/api";

@Component({
  selector: "app-contract-list",
  templateUrl: './verifypod-form.component.html',
})
export class VerifypodformComponent implements OnInit {
  private baseUrl = "http://localhost:8000/stapi/v1/drs/";

  verifypodForm: FormGroup;
  currentStep: number = 0;
  messages: any[] = [];
  operationSuccessful: boolean = false;
  createdOrEditedDepot: any;
  suggestions: any[] = [];
  steps: MenuItem[]|undefined;
  dates: Date[] | undefined;
  isToPayRefVisible: boolean[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private http: HttpClient,
  ) {
    this.verifypodForm = this.fb.group({
      id: [''],
      drsDate: [''],
      vehicleNo: [''],
      vehicle_num: [''],
      driverName: [''],
      driverMobileNo: [''],
      plase: [''],
      CustName:[''],
      podlr:[''],
      pod_artefact_url:[''],
      verified:[''],
      total_num_of_pkgs:[''],
      delivered_at:[''],
      DRSNO:[''],
      delivered:[''],
      del_datetime:[''],
      qty: [''],
      hamali: [''],
      toPayRate: [''],
      lateReason: [''], // Added form control for 'lateReason'
      deliveryDate: [''], // Added form control for 'deliveryDate'
      verification: this.fb.array([]), // Define verification as FormArray
      ToPayType: [''],
      ToPayref: [''] // Added form control for 'verification'
    });
  }

  ngOnInit(): void {
    // Check if createdOrEditedDepot is not null or undefined
    if (this.createdOrEditedDepot && this.createdOrEditedDepot.drsno_data) {
      // Initialize isToPayRefVisible array with false values for each row
      this.createdOrEditedDepot.drsno_data.forEach(() => {
        this.isToPayRefVisible.push(false);
        (this.verifypodForm.get('verification') as FormArray).push(this.fb.control(''));
      });
    }
  }
  

  toggleToPayRefInput(visible: boolean, index: number) {
  // Set the visibility of the ToPayRef input for the selected column
  this.isToPayRefVisible[index] = visible;

  // Get the FormArray for verification
  const verificationArray = this.verifypodForm.get('verification') as FormArray;

  // Ensure verificationArray is defined before accessing its properties
  if (verificationArray) {
    // Get the control for the selected row
    const rowControl = verificationArray.at(index);

    // Ensure rowControl is defined before accessing its properties
    if (rowControl) {
      // Update the ToPayType value for the selected row
      rowControl.get('ToPayType')?.setValue(visible ? 'Bank' : 'Cash');

      // If Cash is selected, clear the ToPayRef value for the selected column
      if (!visible) {
        const toPayRefControl = rowControl.get('ToPayref');
        if (toPayRefControl) {
          toPayRefControl.setValue('', { emitEvent: false });
        }
      }
    }

    // Hide the ToPayRef input for other columns
    for (let i = 0; i < this.isToPayRefVisible.length; i++) {
      if (i !== index) {
        this.isToPayRefVisible[i] = false;
      }
    }
  }
}

  
  searchCity(event: any) {
    const searchTerm = event.query;
    this.http.get<any[]>(`${this.baseUrl}drsnoautoco/${searchTerm}`)
      .subscribe(
        (response: any[]) => {
          this.suggestions = response;
        },
        (error) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error fetching suggestions' }];
          console.error("Error fetching suggestions:", error);
        }
      );
  }

  autoCompleteChange(event: any) {
    const selectedId = event.value.id;
    if (selectedId) {
      this.http.get<any>(`${this.baseUrl}fetch-drs-data/${selectedId}`)
        .subscribe(
          (response: any) => {
            if (response && response.original) {
              this.createdOrEditedDepot = response.original;
              console.log(this.createdOrEditedDepot);

              this.operationSuccessful = true;
            } else {
              this.operationSuccessful = false;
            }
          },
          (error) => {
            this.operationSuccessful = false;
            console.error("Error fetching data:", error);
          }
        );
    }
  }

  getDeliveredClass(delivered: number): string {
    return delivered === 1 ? 'delivered-green' : ''; 
  }

  getVerificationClass(verified: number): string {
    switch (verified) {
      case 1:
        return 'verified-green';
      case 4:
        return 'dispute-red';
      case 0:
        return 'dispute';
      default:
        return '';
    }
  }
  getVerificationValue(index: number): string {
    const verificationArray = this.verifypodForm.get('verification') as FormArray;
    if (verificationArray && index >= 0 && index < verificationArray.length) {
      return verificationArray.at(index)?.value || ''; 
    }
    return ''; 
  }
  
  onVerificationChange(value: string, index: number) {
    const verificationArray = this.verifypodForm.get('verification') as FormArray;
    if (verificationArray) {
      const controlAtIndex = verificationArray.at(index);
      if (controlAtIndex) {
        controlAtIndex.setValue(value);
      } else {
        console.error(`Control at index ${index} is undefined.`);
      }
    } else {
      console.error('FormArray is undefined.');
    }
  }
  
  onSubmit() {
  }

  resetFormAndNavigateBack() {
  }
}