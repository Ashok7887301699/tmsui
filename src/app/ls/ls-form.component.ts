import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService,ConfirmationService  } from "primeng/api";
import { LsService } from "./services/ls.service";
import { ls } from "./models/ls.model";
@Component({
  selector: 'app-ls-form',
  templateUrl: "./ls-form.component.html",
  styles: ``
})

export class LsFormComponent implements OnInit {
  lsForm: FormGroup;
  isEditMode: boolean = false;
  lsId: number | null = null;
  steps: any[] = []; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedls: ls | null = null; // Store the tenant data after successful operation
  errorMessage: string = ""; // Store error message
  DestinationOptions:any[]=[];
  filteredCustomLrnum: any[] = [];
  rows: any[] = []; 
  totalPkgsNo: number = 0;
  totalWeight: number = 0;
  showDestination: boolean = false;
  displayConfirmation: boolean = false;
  action: string = '';
  currentSeqNum: number = 1;

  constructor(
    private fb: FormBuilder,
    private LsService: LsService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private ConfirmationService :ConfirmationService
  ) {
    this.lsForm = this.fb.group({
     
      custom_lr_num: ["", Validators.required],
      Destination: [""],
      gppercentage : [""],
      TotalToPay : [""],
      freight_charges:[""],
   
      // status: ["", Validators.required]
    });

    this.steps = [{ label: "Loading Sheet Form" }, { label: "Loading Sheet Details" }];
  }

  
  fetchdeponame() {
    this.LsService.getdepotname().subscribe(
      (response: any) => {
        console.log("Response:", response); // Log the response to see its structure
        if (Array.isArray(response)) {
          this.DestinationOptions = response.map((item: string) => ({
            label: item,
            value: item,
          }));
        } else if (response && Array.isArray(response.BranchCode)) {
          this.DestinationOptions = response.BranchCode.map(
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


  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["lsId"]) {
        this.isEditMode = true;
        this.lsId = params["lsId"];
        if (this.lsId !== null) {
          this.loadlsData(this.lsId);
        }
      }
    });
    this.fetchdeponame();
  }

  filterLr(event: any): void {
    const query = event.query;
    this.LsService.getLrdata(query).subscribe(
      (data: any[]) => {
        this.filteredCustomLrnum = data.map(item => ({ label: item.id, value: item.id }));
      },
      (error) => {
        console.error("Error fetching LR data:", error);
        // Handle error
      }
    );
  }


  // addRow(): void {
  //   const data = {
  //     LRNO: '',
  //     LRDate: '',
  //     PayBasis: '',
  //     FromPlace: '',
  //     ToPlace: '',
  //     ArriveDate: '',
  //     PkgsNo: '',
  //     ActualWeight: '',
  //     DocketTotal: '',
  //     InvoiceNo: '',
  //     Consignor: '',
  //     Consignee: ''
  //   };
  
  //   const newRow = this.createTableRow(data);
  //   const bodyTemplate = document.querySelector('#lrdetailsbody');
  //   if (bodyTemplate) {
  //     bodyTemplate.appendChild(newRow);
  //   } else {
  //     console.error("Body template not found.");
  //   }
  // }

  // addRow(): void {
  //   const lrNoInput = this.lsForm.get('custom_lr_num').value;
  
  //   if (lrNoInput && lrNoInput.value) {
  //     const lrNo = lrNoInput.value.trim(); // Get the LR number
  
  //     // Use the selected LR number to fetch LR details
  //     this.LsService.getLrDetails(lrNo).subscribe(
  //       (lrDetails: any) => {
  //         console.log("Fetched LR details:", lrDetails); // Log fetched LR details
  
  //         // Populate the new row with the fetched LR details
  //         const newRowData = {
  //           LRNO: lrDetails.LRNO,
  //           LRDate: lrDetails.LRDate,
  //           PayBasis: lrDetails.PayBasis,
  //           FromPlace: lrDetails.FromPlace,
  //           ToPlace: lrDetails.ToPlace,
  //           ArriveDate: lrDetails.ArriveDate,
  //           PkgsNo: lrDetails.PkgsNo,
  //           ActualWeight: lrDetails.ActualWeight,
  //           DocketTotal: lrDetails.DocketTotal,
  //           InvoiceNo: lrDetails.InvoiceNo,
  //           Consignor: lrDetails.Consignor,
  //           Consignee: lrDetails.Consignee
  //         };
  
  //         const newRow = this.createTableRow(newRowData);
  //         const bodyTemplate = document.querySelector('#lrdetailsbody');
  
  //         if (bodyTemplate) {
  //           bodyTemplate.appendChild(newRow);
  //           this.updateTotalPkgsNo();
  //           this.updateTotalactual_weight();
  //         } else {
  //           console.error("Body template not found.");
  //         }
  //       },
  //       (error) => {
  //         console.error("Error fetching LR details:", error);
  //         // Handle error
  //       }
  //     );
  //   } else {
  //     console.error("LR number input is empty.");
  //     // Handle case where LR number input is empty
  //   }
  // }

  
  addRow(): void {
    const lrControl = this.lsForm.get('custom_lr_num');
  
    if (lrControl && typeof lrControl.value === 'string') {
      const lrNo = lrControl.value.trim(); // Get the LR number
  
      // Use the selected LR number to fetch LR details
      this.LsService.getLrDetails(lrNo).subscribe(
        (lrDetails: any) => {
          console.log("Fetched LR details:", lrDetails); // Log fetched LR details
          // Further logic for adding row goes here...
          const newRow = this.createTableRow(lrDetails);
          const bodyTemplate = document.querySelector('#lrdetailsbody');
          if (bodyTemplate) {
            bodyTemplate.appendChild(newRow);
            this.updateTotalPkgsNo();
            this.updateTotalactual_weight();
          } else {
            console.error("Body template not found.");
          }
      
        },
        (error) => {
          console.error("Error fetching LR details:", error);
        }
      );
    } else if (lrControl && typeof lrControl.value === 'object' && 'value' in lrControl.value) {
      const lrNo = lrControl.value.value.trim(); 
  
      this.LsService.getLrDetails(lrNo).subscribe(
        (lrDetails: any) => {
          console.log("Fetched LR details:", lrDetails);
          const newRow = this.createTableRow(lrDetails);
          const bodyTemplate = document.querySelector('#lrdetailsbody');
          if (bodyTemplate) {
            bodyTemplate.appendChild(newRow);
            this.updateTotalPkgsNo();
            this.updateTotalactual_weight();
          } else {
            console.error("Body template not found.");
          }
        
        },
        (error) => {
          console.error("Error fetching LR details:", error);
          // Handle error
        }
      );
    } else {
      console.error("LR number input is empty or invalid.");
      // Handle case where LR number input is empty or invalid
    }
  }
 
createTableRow(data: any): HTMLTableRowElement {
  const row = document.createElement('tr');
  row.innerHTML = `
  <td class="seq_num" style="text-align: center;">
      <input type="text" class="seq-num" value="${this.currentSeqNum}" formControlName="seq_num" pInputText>
    </td>
    <td class="str_lr_no" style="text-align: center;">${data.lr_id || '0'}</td>
    <td class="lrdate" style="text-align: center;" >${(data.booking_date_time || '0000-00-00').split(' ')[0]}</td>
    <td class="paytype" style="text-align: center;" >${data.payment_type || 'NA'}</td>
    <td class="from_location" style="text-align: center;">${data.from_place || 'NA'}</td>
    <td class="to_location" style="text-align: center;">${data.to_place || 'NA'}</td>
    <td class="arrive_date" style="text-align: center;" >${(data.booking_date_time || '0000-00-00').split(' ')[0]}</td>
    <td class="PkgsNo" style="text-align: center;">${data.num_of_pkgs || '0'}</td>
    <td class="actual_weight" style="text-align: center;">${data.actual_weight_per_pkg || '0'}</td>
    <td class="grandtotal" style="text-align: center;">${data.docket_total_charges || '0'}</td>
    <td class="InvoiceNo" style="display:none!important;">${data.InvoiceNo || '0'}</td>
    <td class="Consignor" style="display:none!important;">${data.Consignor || '0'}</td>
    <td class="Consignee" style="display:none!important;">${data.Consignee || '0'}</td>
    <td style="text-align: center;"><button class="delete-btn" style="border:none;background-color: white;cursor: pointer;"><i class="pi pi-trash action-icons" ></i></button></td>
  `;

  const seqNumInput = row.querySelector('.seq-num') as HTMLInputElement;
  seqNumInput.value = this.currentSeqNum.toString();
  this.currentSeqNum++;

  const deleteButton = row.querySelector('.delete-btn') as HTMLButtonElement;
  deleteButton.addEventListener('click', () => this.deleteRow(row));



  // Update total pkgs no and total actual weight directly
  this.updateTotalPkgsNo();
  this.updateTotalactual_weight();

      // Update Total ToPay if payment_type is TO PAY
      if (data.payment_type === 'TOPAY') {
        const totalToPayInput = document.getElementById('TotalToPay') as HTMLInputElement;
        const currentTotalToPay = parseFloat(totalToPayInput.value) || 0;
        const docketTotal = parseFloat(data.docket_total_charges) || 0;
        totalToPayInput.value = (currentTotalToPay + docketTotal).toFixed(2);
    }

  return row;
}

  
updateTotalPkgsNo() {
  this.totalPkgsNo = 0;
  const pkgsNoCells = document.querySelectorAll('.PkgsNo');
  pkgsNoCells.forEach((cell) => {
    const content = cell.textContent;
    if (content !== null) {
      this.totalPkgsNo += parseInt(content.trim() || '0', 10);
    }
  });

  const totalPkgsNoElement = document.getElementById('totalqty');
  if (totalPkgsNoElement) {
    totalPkgsNoElement.textContent = this.totalPkgsNo.toString();
  }
}

updateTotalactual_weight() {
  this.totalWeight = 0;
  const actualWeightCells = document.querySelectorAll('.actual_weight');
  actualWeightCells.forEach((cell) => {
    const content = cell.textContent;
    if (content !== null) {
      this.totalWeight += parseInt(content.trim() || '0', 10);
    }
  });

  const totalweightElement = document.getElementById('totalwt');
  if (totalweightElement) {
    totalweightElement.textContent = this.totalWeight.toString();
  }
}

  
deleteRow(row: HTMLTableRowElement): void {
  const tbody = row.parentNode;
  if (tbody) {
      tbody.removeChild(row);
      this.updateTotalPkgsNo();
      this.updateTotalactual_weight();
  }
}

  private loadlsData(lsId: number): void {
    this.fetchdeponame();
    this.LsService.getlsById(lsId).subscribe(
      (ls: ls) => this.lsForm.patchValue(ls),
      (error) => this.handleError(error)
    );
  }

  createDRS(): void {
    if (this.lsForm.valid) {
      const lsData = this.prepareLsData("D"); // Prepare LS data
      this.action = "create DRS";
      this.submitLsData(lsData, "DRS"); // Submit LS data
    }
  }
  
  createTHC(): void {
    if (this.lsForm.valid) {
      const lsData = this.prepareLsData("T"); // Prepare LS data
      if (this.lsForm.controls['Destination'].value) {
        this.action = "create THC";
        this.submitLsData(lsData, "THC"); // Submit LS data
      } else {
        this.messageService.add({severity:'warn', summary:'Warning', detail:'Please select a destination.'});
        this.showDestination = true;
      }
    }
  }



//   executeAction() {
//     if (this.action === 'create DRS') {
//         // Implement create DRS logic here
//         this.onSubmit();
//         this.messageService.add({severity:'success', summary:'Success', detail:'DRS created successfully.'});
//     } else if (this.action === 'create THC') {
//         // Implement create THC logic here
//         this.showDestination = false; // Hide the destination dropdown after THC creation
//         this.onSubmit();
//         this.messageService.add({severity:'success', summary:'Success', detail:'THC created successfully.'});
//     }
//     this.displayConfirmation = false;
// }

  // onSubmit(): void {
  //   if (this.lsForm.valid) {
  //     const lsData = this.lsForm.value;
  //     const lrIds = this.getSelectedLRIds();
  //     console.log("lsData", lsData);
  //     console.log("lrIds", lrIds);

  //     if (this.isEditMode && this.lsId) {
  //       this.LsService.updatels(this.lsId, lsData).subscribe(
  //         (ls) => this.handleSuccess("Loading sheet updated successfully", ls),
  //         (error) => this.handleError(error)
  //       );
  //     } else {
  //       this.LsService.createls(lsData).subscribe(
  //         (ls) => this.handleSuccess("Drs created successfully", ls),
  //         (error) => this.handleError(error)
  //       );
  //     }
  //   }
  // }
  private prepareLsData(prefix: string): any {
    const lsData = this.lsForm.value;
  
    // Set current date for 'dated' field
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    // Set formatted date to 'dated' field
    lsData.dated = formattedDate;

    lsData.prefix =prefix;
    // Set 'ContractAmount' as 'freight_charges' and convert it to a number
    lsData.del_depot = this.lsForm.get('Destination')?.value || ''; // If no value, assign empty string
    lsData.from_depot = this.lsForm.get('Destination')?.value || ''; // If no value, assign empty string
    lsData.to_depot = this.lsForm.get('Destination')?.value || ''; 
    lsData.freight_charges = this.lsForm.get('freight_charges')?.value || 0; // If no value, assign 0

    // Get selected LR IDs from the table
    const ls_lr_data = this.getSelectedLRIds();
    // lsData["ls_lr_data"] = ls_lr_data.map((lr) => ({ lr_id: lr }));
    lsData["ls_lr_data"] = ls_lr_data;
  
    // Log the prepared lsData
    console.log("Prepared lsData", lsData);
  
    return lsData;
  }
  
  
  private submitLsData(lsData: any, action: string): void {
    console.log("lsData",lsData);
    if (this.isEditMode && this.lsId) {
      this.LsService.updatels(this.lsId, lsData).subscribe(
        (ls) => this.handleSuccess(`Loading Sheet created for ${action}`, ls), // Display action specific success message
        (error) => this.handleError(error)
      );
    } else {
      this.LsService.createls(lsData).subscribe(
        (ls) => this.handleSuccess(`Loading Sheet created for ${action}`, ls), // Display action specific success message
        (error) => this.handleError(error)
      );
    }
  }
//   getSelectedLRIds(): string[] {
//     const lrIds: string[] = [];
//     const rows = document.querySelectorAll('#lrdetailsbody tr'); // Select all table rows in the tbody

//     rows.forEach(row => {
//         const lrId = row.querySelector('.str_lr_no')?.textContent; // Fetch LR ID from the LR_NO column
//         if (lrId) {
//             lrIds.push(lrId);
//         }
//     });

//     return lrIds;
// }

private getSelectedLRIds(): { lr_id: string, seq_num: number }[] {
  const lrData: { lr_id: string, seq_num: number }[] = [];
  const rows = document.querySelectorAll('#lrdetailsbody tr');

  rows.forEach(row => {
      const lrId = row.querySelector('.str_lr_no')?.textContent || '0';
      const seqNum = parseInt((row.querySelector('.seq-num') as HTMLInputElement)?.value || '1', 10);
      lrData.push({ lr_id: lrId, seq_num: seqNum });
  });

  return lrData;
}

  
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private handleSuccess(message: string, ls: ls | null): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedls = ls;
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
    this.router.navigate(["/fm/ls"]);
    this.lsForm.reset(); // Reset the form when canceling the operation
  }

  resetFormAndNavigateBack(): void {
    this.lsForm.reset();
    this.router.navigate(["/fm/ls"]);
  }

}
