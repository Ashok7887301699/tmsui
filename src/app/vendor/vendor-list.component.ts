import { Component, OnInit,ViewChild } from "@angular/core";
import { MessageService } from "primeng/api";
import { Vendor } from "./models/vendor.model";
import { VendorService } from "./services/vendor.service";
import { VendorStateService } from "./services/vendor-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { HttpClient } from '@angular/common/http';

import * as XLSX from "xlsx"; // Import XLSX library for Excel export


@Component({
  selector: "app-vendor-list",
  templateUrl: "./vendor-list.component.html",
})
export class VendorListComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  vendors: Vendor[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedVendorId: number | null = null;

  rowsPerPageOptions = [10, 20, 50, 100];
  perPage: number = this.rowsPerPageOptions[0];

  navigatedFromListView: boolean = false;

  @ViewChild("fileInput") fileInput!: any;

  // Dropdown options
  statusOptions = [
    // { label: "NONE", value: 'NONE' },
    // { label: "REGISTERED", value: "REGISTERED" },
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  sortByOptions = [
    // { label: "None", value: 'None' },
    { label: "VendorCode", value: "VendorCode" },
    { label: "Status", value: "status" },
    { label: "Created At", value: "created_at" },
    { label: "Updated At", value: "updated_at" },
  ];

  sortOrderOptions = [
    // { label: "None", value: 'None' },
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];

  constructor(
    private http: HttpClient,
    private vendorService: VendorService,
    private messageService: MessageService,
    private vendorStateService: VendorStateService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.breadcrumbItems = [
      {
        icon: "pi pi-fw pi-database",
        label: "Master Data",
        routerLink: "/home",
      },
      { label: "Vendor", routerLink: "/md/vendor" },
      { label: "List" },
    ];
    this.restoreStateAndLoadVendors();
  }


  exportToExcel() {
    const fileName = "vendor-list.xlsx"; 
    const excelData: any[] = this.vendors.map((vendor, index) => {
      return {
        "Sr.No": index + 1,
        "Vendor Code": vendor.VendorCode,
        "Vendor Name": vendor.VendorName,
        "Vendor Type": vendor.Type,
        "Vendor Address": vendor.Address,
        "Vendor City": vendor.City,
        "Vendor Depot": vendor.Depot,
        "Vendor Vehicle": vendor.Vehicle,
        "Vendor Pincode": vendor.Pincode,
        "Vendor Mobile_No": vendor.Mobile_No,
        "Vendor Email": vendor.Email,
        "Vendor PAN_No": vendor.PAN_No,
        "Vendor GSTNO": vendor.GSTNO,
        "Vendor BankName": vendor.BankName,
        "Vendor AccountNO": vendor.AccountNO,
        "Vendor IFSC": vendor.IFSC,
        "Vendor Category": vendor.Category,
        "Vendor status": vendor.status,
        "Vendor created_at": vendor.created_at,
        "Vendor updated_at": vendor.updated_at,
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData); 
    const wb: XLSX.WorkBook = XLSX.utils.book_new(); 
    XLSX.utils.book_append_sheet(wb, ws, "VendorList"); 

    XLSX.writeFile(wb, fileName); 
  }


  downloadExcelFormat() {
    const headers = [
      // "id",
        "VendorCode",
        "VendorName",
        "Type",
        "Address",
        "City",
        "Depot",
        "Vehicle",
        "Pincode",
        "Mobile_No",
        "Email",
        "PAN_No",
        "GSTNO",
        "BankName",
        "AccountNO",
        "IFSC",
        "Category",
        "U_Location",
        "status",
    ];

    const data: any[] = [
      headers, 
      [],
    ];

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, "vendor_template.xlsx");
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
  
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
  
      if (!jsonData || jsonData.length === 0) {
        console.error("No data found in the Excel file.");
        return;
      }
  
      // console.log("Data from Excel:", jsonData);
  
      const vendors: Vendor[] = jsonData.map((row: any) => this.mapRowToVendorData(row));
  
      this.sendVendorDataToServer(vendors);
    };
  
    reader.readAsArrayBuffer(file);
  }

  mapRowToVendorData(row: any): Vendor {
    return {
      id: row.id,
      VendorCode: row.VendorCode || '',
      VendorName: row.VendorName || '',
      Type: row.Type || '',
      Address: row.Address || '',
      City: row.City || '',
      Depot: row.Depot || '',
      Vehicle: row.Vehicle || '',
      Pincode: row.Pincode || '',
      Mobile_No: row.Mobile_No || '',
      Email: row.Email || '',
      PAN_No: row.PAN_No || '',
      GSTNO: row.GSTNO || '',
      BankName: row.BankName || '',
      AccountNO: row.AccountNO || '',
      IFSC: row.IFSC || '',
      Category: row.Category || '',
      U_Location: row.U_Location || '', 
      status: (row.status || 'Active').toLowerCase(),
      created_at: '',
      updated_at: '',
    };
  }

  sendVendorDataToServer(vendors: Vendor[]) {
    console.log("Data to send to server:", vendors);
  
    this.vendorService.importExcel(vendors).subscribe(
      (response: any) => {
        console.log("Vendors successfully sent to the server:", response);
        this.messageService.add({severity:'success', summary:'Success', detail:'Vendors successfully sent to the server'});
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      (error: any) => {
        console.error("Error while sending vendors to the server:", error);
      }
    );
  }
  
  
  

  // extractErrorMessage(errors: any[]): string {
  //   let errorMessage = '';
  //   if (errors && Array.isArray(errors)) {
  //     errorMessage = errors.map((error: any) => error.message).join('; ');
  //   }
  //   return errorMessage;
  // }
 
  
  
  
  resetFormAndNavigateBack() {
    // Implement logic to reset form and navigate back
  }
  
  cancel() {
    // Implement cancelation logic
  }
  
  

  restoreStateAndLoadVendors() {
    this.vendorStateService.getVendorListState().subscribe((state) => {
      if (state) {
        this.filters = state.filters;
        this.currentPage = state.currentPage;
        this.perPage = state.perPage;
        this.selectedVendorId = state.selectedVendorId;
        this.navigatedFromListView = state.navigatedFromListView;
      }
    });
    this.loadVendors();
  }

  loadVendors(event?: any) {
    this.loading = true;

    let page = this.currentPage || 1;
    let perPage = this.perPage || 10;

    if (event) {
      page =
        event.first !== undefined && event.rows
          ? event.first / event.rows + 1
          : 1;
      perPage = event.rows || 10;
    }

    this.vendorService
      .getVendors(page, perPage, this.prepareFiltersForAPI())
      .subscribe(
        (response: Vendor[] | any) => {
          if (Array.isArray(response)) {
            this.vendors = response;
            this.totalRecords = response.length;
          } else {
            this.vendors = response.data;
            this.totalRecords = response.total;
          }
          this.loading = false;
        },
        (error: any) => {
          console.error("Error fetching vendors:", error);
          this.loading = false;
        }
      );
  }

  applyFilters() {
    // Validate and then load tenants
    console.log("Loading vendors after applying filters.");
    if (this.validateDates()) {
      this.loadVendors();
    }
  }
  resetOneByOneFilters(): void {
    if (this.filters.VendorCode !== "") {
      this.filters.VendorCode = "";
      this.applyFilters();
    } else if (this.filters.Status !== null) {
      this.filters.Status = null;
      this.applyFilters();
    } else if (this.filters.created_from !== null) {
      this.filters.created_from = null;
      this.applyFilters();
    } else if (this.filters.created_to !== null) {
      this.filters.created_to = null;
      this.applyFilters();
    } else if (this.filters.updated_from !== null) {
      this.filters.updated_from = null;
      this.applyFilters();
    } else if (this.filters.updated_to !== null) {
      this.filters.updated_to = null;
      this.applyFilters();
    } else if (this.filters.sort_by !== null) {
      this.filters.sort_by = null;
      this.applyFilters();
    } else if (this.filters.sort_order !== null) {
      this.filters.sort_order = null;
      this.applyFilters();
    }
  }
  resetAllFilters(): void {
    // Assuming default values for filters. Adjust based on your initial filter setup.
    this.filters = {
      VendorCode: "",
      Status: null,
      created_from: null,
      created_to: null,
      updated_from: null,
      updated_to: null,
      sort_by: null,
      sort_order: null,
    };

    // After resetting filters, apply them.
    this.applyFilters();
  }

  prepareFiltersForAPI() {
    const filtersForAPI = { ...this.filters };

    // Date conversion for API
    if (filtersForAPI.created_from) {
      filtersForAPI.created_from.setHours(0, 0, 0, 0);
      filtersForAPI.created_from =
        filtersForAPI.created_from.toISOString().split("T")[0] +
        "T00:00:00.000";
    }
    if (filtersForAPI.created_to) {
      filtersForAPI.created_to.setHours(23, 59, 59, 999);
      filtersForAPI.created_to =
        filtersForAPI.created_to.toISOString().split("T")[0] + "T23:59:59.999";
    }
    // Similar conversion for updated_from and updated_to
    if (filtersForAPI.updated_from) {
      filtersForAPI.updated_from.setHours(0, 0, 0, 0);
      filtersForAPI.updated_from =
        filtersForAPI.updated_from.toISOString().split("T")[0] +
        "T00:00:00.000";
    }
    if (filtersForAPI.updated_to) {
      filtersForAPI.updated_to.setHours(23, 59, 59, 999);
      filtersForAPI.updated_to =
        filtersForAPI.updated_to.toISOString().split("T")[0] + "T23:59:59.999";
    }

    return filtersForAPI;
  }

  validateDates() {
    const { created_from, created_to, updated_from, updated_to } = this.filters;

    if ((created_from && !created_to) || (!created_from && created_to)) {
      this.showError("Both Created From and Created To dates are required.");
      return false;
    }
    if (created_from && created_to && created_to < created_from) {
      this.showError("Created To date must be after Created From date.");
      return false;
    }

    if ((updated_from && !updated_to) || (!updated_from && updated_to)) {
      this.showError("Both Updated From and Updated To dates are required.");
      return false;
    }
    if (updated_from && updated_to && updated_to < updated_from) {
      this.showError("Updated To date must be after Updated From date.");
      return false;
    }

    return true;
  }

  resetFilters() {
    this.filters = {};
    this.loadVendors();
  }

  resetCreatedDates() {
    this.filters.created_from = null;
    this.filters.created_to = null;
    this.applyFilters();
  }

  resetUpdatedDates() {
    this.filters.updated_from = null;
    this.filters.updated_to = null;
    this.applyFilters();
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: message,
    });
  }

  showError(message: string) {
    this.messageService.add({
      severity: "warn",
      summary: "Warning",
      detail: message,
    });
  }

  createNewRecord() {
    this.router.navigate(["/md/vendor/create"]);
  }

  viewRecord() {
    if (this.selectedVendorId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true;
    this.vendorStateService.setVendorListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedVendorId: this.selectedVendorId,
      navigatedFromListView: this.navigatedFromListView,
    });

    this.router.navigate([`/md/vendor/view/${this.selectedVendorId}`]);
  }

  editRecord() {
    if (this.selectedVendorId === null) {
      this.showError("Please select a Vendor to edit.");
      return;
    }

    this.router.navigate([`/md/vendor/edit/${this.selectedVendorId}`]);
  }

  deactivateRecord() {
    if (this.selectedVendorId === null) {
      this.showError("Please select a vendor to deactivate.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this Vendor?",
      accept: () => {
        if (typeof this.selectedVendorId === "number") {
          this.vendorService.deactivateVendor(this.selectedVendorId).subscribe(
            () => {
              this.showSuccess(
                `Vendor with ID ${this.selectedVendorId} deactivated successfully`
              );
              this.loadVendors();
            },
            (error: any) => this.showError("Error deactivating Vendor")
          );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedVendorId === null) {
      this.showError("Please select a Vendor to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this Vendor?",
      accept: () => {
        if (typeof this.selectedVendorId === "number") {
          this.vendorService.deleteVendor(this.selectedVendorId).subscribe(
            () => {
              this.showSuccess(
                `vendor with ID ${this.selectedVendorId} deleted successfully`
              );
              this.loadVendors();
            },
            (error: any) => this.showError("Error deleting vendor")
          );
        }
      },
    });
  }

  onRowSelect(event: any) {
    this.selectedVendorId = event.data.id;
  }

  onRowUnselect(event: any) {
    this.selectedVendorId = null;
  }
  
}
