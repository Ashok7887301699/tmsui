import { Component, OnInit, Output , EventEmitter,Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ContractService } from "./services/contract.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ConfigService } from "../core/config/config.service";
import { ConfirmationService } from "primeng/api";
import * as XLSX from "xlsx";
import { Contract } from "./models/contract.model";

interface doordeliveryData {
  from_place: string;
  to_place: string;
  rate: string;
}

@Component({
  selector: "app-doordelivery",
  templateUrl: "./contractdoordeliverie.component.html",
})
export class contractdoordeliverieComponent implements OnInit {
  @Input() contract: Contract | null = null;

 
  @Output() servicedoordelivery: EventEmitter<void> = new EventEmitter<void>();

  products!: [];
  fromPlace: string | undefined;
  fromPlaceSuggestions: any[] = [];
  cols: any[] | undefined;
  doordeliveryForm: FormGroup;
  isEditMode: boolean = false;
  id: any;
  steps: any[];
  currentStep: number = 0;
  messages: any[] = [];
  operationSuccessful: boolean = false;
  createdOrEditedDepot: any;
  tableData: any;
  suggestions: any[] = [];
  definationUrl: string;
  contract_id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private configService: ConfigService
  ) 
  {
    this.definationUrl = this.configService.apiUrl + '/Contract/doordelivery';
    this.doordeliveryForm = this.fb.group({
      doordeliverys: this.fb.array([]) // Create form array to hold multiple contract slab rates
    });

    this.steps = [{ label: "Depot Form" }, { label: "Depot Details" }];
  }

  ngOnInit(): void {
    this.addRow(); // Add initial row when component initializes
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.contract_id = params["id"];
        if (this.contract_id !== null) {
          this.loadContractData(this.contract_id);
        }
      }
    });
  }

  get doordeliverys(): FormArray {
    return this.doordeliveryForm.get('doordeliverys') as FormArray;
  }

  createdoordelivery(): FormGroup {
    return this.fb.group({
      from_place: ["", Validators.required],
      to_place: ["", Validators.required],
      rate: ["", Validators.required],
     
    });
  }

  addRow(): void {
    this.doordeliverys.push(this.createdoordelivery());
  }

  onSubmit(): void {
    if (this.doordeliveryForm && this.doordeliveryForm.valid) {
      const contractData: any[] = this.doordeliveryForm.get('doordeliverys')!.value;
  
      const transformedData = contractData.map(item => ({
        contract_id: this.contract?.contract_id ?? 0,
        from_place: item.from_place.label,
        to_place: item.to_place.label,
        rate: item.rate
      }));
      if (this.isEditMode && this.contract_id) {
        const contract_id = this.contract_id;
        console.log(this.contract_id);
        this.contractService.updatedoordelivery(contract_id, transformedData).subscribe(
          (contract) => this.handleSuccess("Service updated successfully",contract),
          (error) => this.handleError(error)
        );
      } else {
        this.http.post<any>(this.definationUrl, { data: transformedData })
        .subscribe(
          (response: any) => {
            this.handleSuccess("Contract slab rate saved successfully", response);
          },
          (error: any) => {
            console.error("An error occurred:", error);
            this.handleError(error);
          }
        );
      }
    } 
  }
  
  

  
  private loadContractData(contract_id: number): void {
    this.contractService.getdoordeliveryById(contract_id).subscribe(
      (contracts: any[]) => { // Specify the type of the contracts array
        if (contracts && contracts.length > 0) {
          const formArray = this.doordeliveryForm.get('doordeliverys') as FormArray;
          formArray.clear();
          contracts.forEach(contract => {
            formArray.push(this.createDoordeliveryFormGroup(contract));
          });
        }
      },
      (error) => this.handleError(error)
    );
  }
  
  private createDoordeliveryFormGroup(contract: any): FormGroup {
    return this.fb.group({
      from_place: [contract.from_place],
      to_place: [contract.to_place],
      rate: [contract.rate]
    });
  }
  
  

  handleSuccess(message: string, contract: any): void {
    console.log(message);
    console.log("Contract details:", contract); 
     this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
     this.operationSuccessful = true;
     this.servicedoordelivery.emit();
    // setTimeout(() => {
    //   this.router.navigate(['md/contract/contractslabdefinitions']); // Replace '/redirect-url' with your desired URL
    // }, 1000);
  }

  handleError(error: any): void {
    console.error("An error occurred:", error);
    this.operationSuccessful = false;
  }

  Upload(event: any) {
    console.log("Files found.");
  
    const fileList: FileList | null = event.target.files;
    if (!fileList || fileList.length === 0) {
      console.error("Files not found.");
      return;
    }
  
    const file: File = fileList[0];
    const reader: FileReader = new FileReader();
  
    // Show confirmation dialog before uploading
    const confirmed = confirm("Are you sure you want to upload this file?");
    if (!confirmed) {
      console.log("File upload canceled.");
      this.messageService.add({ severity: 'info', summary: 'File Upload Canceled', detail: 'You canceled the file upload.' });
      return;
    }
  
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
      const requestData: { data: doordeliveryData[] } = { data: [] };
  
      if (Array.isArray(jsonData)) {
        jsonData.forEach((row: any) => {
          const contractData: doordeliveryData = this.mapRowToContractData(row);
          requestData.data.push(contractData);
        });
      } else {
        console.error("No data found in the Excel file.");
        return;
      }
      this.sendDataToServer(requestData);
    };
  
    reader.readAsArrayBuffer(file);
  }

  mapRowToContractData(row: any): doordeliveryData {
    return {
      from_place: row.from_place,
      to_place: row.to_place,
      rate: row.rate
    };
  }

  sendDataToServer(requestData: { data: doordeliveryData[] }) {  
    // Assuming you have imported HttpClient from '@angular/common/http'
    const dataWithContractId = requestData.data.map(item => ({
      ...item,
      contract_id: this.contract?.contract_id ?? 0
    }));
  
    // Add data with contractId to the requestData object
    const requestDataWithContractId = { data: dataWithContractId };
    this.http.post(`${this.definationUrl}`, requestDataWithContractId).subscribe(
      (response: any) => {
        this.handleSuccess("Excel data uploaded successfully", response);
      },
      (error: any) => {
        console.error("An error occurred while uploading Excel data:", error);
        this.handleError(error);
      }
    );
  }


  resetFormAndNavigateBack() {}

  cancel() {}








  downloadExcelFormat() {
    // Define the column headers
    const headers = [
      "from_place",
      "to_place",
      "rate",
    
    ];
    const data: any[] = [
      headers,
      [],
    ];


    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);


    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "Door_Delivery_Rate_template.xlsx");
  }


  searchcity(event: any) {
    this.contractService.searchfromCity(event.query).subscribe((response: any[]) => {
      this.suggestions = response.map((item) => ({
        label: `${item.CityNameEng}`,
        value: item.CityNameEng,
      }));
      console.log(this.suggestions);
    });
  }
  

  searchtocity(event: any) {
    this.contractService.searchfromCity(event.query).subscribe((response: any[]) => {
      this.suggestions = response.map((item) => ({
        label: `${item.CityNameEng}`,
        value: item.CityNameEng,
      }));
      console.log(this.suggestions);
    });
  }
}
