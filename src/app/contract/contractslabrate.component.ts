import { Component, OnInit, Output , EventEmitter,Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ContractService } from "./services/contract.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ConfigService } from "../core/config/config.service";
import { ConfirmationService } from "primeng/api";
import { Contract } from "./models/contract.model";
import * as XLSX from "xlsx";

interface ContractSlabRateData {
  from_place: string;
  to_place: string;
  transit_tat: string;
  zone: string;
  slab1: string;
  slab2: string;
  slab3: string;
  slab4: string;
  slab5: string;
  slab6: string;
  slab7: string;
  slab8: string;
  slab_contract_type: string;
}

@Component({
  selector: "app-Slabrate",
  templateUrl: "./contractslabrate.component.html",
})
export class contractslabrateComponent implements OnInit {
  @Input() contract: Contract | null = null;


  @Output() contractslabrateSuccess = new EventEmitter<void>();

  products!: [];
  fromPlace: string | undefined;
  fromPlaceSuggestions: any[] = [];
  cols: any[] | undefined;
  contractslabrateForm: FormGroup;
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


  constructor(
    private fb: FormBuilder,
    private contractService: ContractService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private configService: ConfigService
  ) {

    this.definationUrl = this.configService.apiUrl + '/Contract/contractslabrate';

    this.contractslabrateForm = this.fb.group({
      contractslabrates: this.fb.array([]) // Create form array to hold multiple contract slab rates
    });

    this.steps = [{ label: "Depot Form" }, { label: "Depot Details" }];
  }

  ngOnInit(): void {
    this.addRow(); // Add initial row when component initializes

  }

  get contractslabrates(): FormArray {
    return this.contractslabrateForm.get('contractslabrates') as FormArray;
  }

  createContractSlabRate(): FormGroup {
    return this.fb.group({
      from_place: ["", Validators.required],
      to_place: ["", Validators.required],
      transit_tat: ["", Validators.required],
      zone: ["", Validators.required],
      slab1: ["", Validators.required],
      slab2: ["", Validators.required],
      slab3: ["", Validators.required],
      slab4: ["", Validators.required],
      slab5: ["", Validators.required],
      slab6: ["", Validators.required],
      slab7: ["", Validators.required],
      slab8: ["", Validators.required],
      slab_contract_type: ["", Validators.required],

    });
  }

  addRow(): void {
    this.contractslabrates.push(this.createContractSlabRate());
  }
  slab_contract_type = [
    { label: "PER_PKG", value: "PER_PKG" },
    { label: "PER_KG", value: "PER_KG" },
    
  ];
  onSubmit(): void {
    if (this.contractslabrateForm && this.contractslabrateForm.valid) {
      const contractData: any[] = this.contractslabrateForm.get('contractslabrates')!.value;
      
      // Transform the data into the expected format
      const transformedData = contractData.map(item => ({
        contract_id: this.contract?.contract_id ?? 0,
        from_place: item.from_place.label,
        to_place: item.to_place.label,
        transit_tat: item.transit_tat,
        zone: item.zone,
        slab1: item.slab1,
        slab2: item.slab2,
        slab3: item.slab3,
        slab4: item.slab4,
        slab5: item.slab5,
        slab6: item.slab6,
        slab7: item.slab7,
        slab8: item.slab8,
        slab_contract_type: item.slab_contract_type,

      }));
  
      console.log("Transformed Data:", transformedData); // Log transformed data
  
      this.http.post<any>(this.definationUrl, { data: transformedData })
        .subscribe(
          (response: any) => {
            console.log("Response:", response); // Log response
            this.handleSuccess("Contract slab rate saved successfully", response);
          },
          (error: any) => {
            console.error("An error occurred:", error);
            this.handleError(error);
          }
        );
    } else {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Please fill in all required fields.'});
    }
  }
  


  handleSuccess(message: string, contract: any): void {
    console.log(message);
    console.log("Contract details:", contract); 
     this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
     this.operationSuccessful = true;
     this.contractslabrateSuccess.emit();  
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
      const requestData: { data: ContractSlabRateData[] } = { data: [] };
  
      if (Array.isArray(jsonData)) {
        jsonData.forEach((row: any) => {
          const contractData: ContractSlabRateData = this.mapRowToContractData(row);
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

  mapRowToContractData(row: any): ContractSlabRateData {
    return {
      from_place: row.from_place,
      to_place: row.to_place,
      transit_tat: row.transit_tat,
      zone: row.zone,
      slab1: row.slab1,
      slab2: row.slab2,
      slab3: row.slab3,
      slab4: row.slab4,
      slab5: row.slab5,
      slab6: row.slab6,
      slab7: row.slab7,
      slab8: row.slab8,
      slab_contract_type: row.slab_contract_type,

    };
  }

  sendDataToServer(requestData: { data: ContractSlabRateData[] }) {
    // Include contractId in each data item
    const dataWithContractId = requestData.data.map(item => ({
      ...item,
      contract_id: this.contract?.contract_id ?? 0
    }));
  
    // Add data with contractId to the requestData object
    const requestDataWithContractId = { data: dataWithContractId };
  
    this.http.post(this.definationUrl, requestDataWithContractId).subscribe(
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
      "transit_tat",
      "zone",
      "slab1",
      "slab2",
      "slab3",
      "slab4",
      "slab5",
      "slab6",
      "slab7",
      "slab8",
      "slab_contract_type",
    
    ];
    const data: any[] = [
      headers,
      [],
    ];


    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);


    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "contractslabrate_template.xlsx");
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
