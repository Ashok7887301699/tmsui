import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { CityMasterService } from "./services/citymaster.service";
import { CityMaster } from "./models/citymaster.model";
import { CityMasterStateService } from "./services/citymaster-state.service";
import { MenuItem } from "primeng/api";
import { ConfirmationService } from "primeng/api";
import * as XLSX from "xlsx"; // Import XLSX library for Excel export

@Component({
  selector: "app-citymaster-list",
  templateUrl: "./citymaster-list.component.html",
})
export class CitymasterListComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  citymaster: CityMaster[] = [];
  totalRecords: number = 0;
  loading: boolean = true;
  rowsPerPageOptions: number[] = [10, 25, 50];
  selectedCityMasterId: number | null = null;

  filters: any = {
    CityNameEng: null,
    Taluka: null,
    District: null,
  };

  currentPage: number | null = null;
  perPage: number = 10;
  navigatedFromListView: boolean | null = null;

  statusDistrict = [
    // // { label: "NONE", value: 'NONE' }, // Allows deselection by setting the value to null
    { label: "Beed", value: "Beed" },
    { label: "Nagar", value: "Nagar" },
  ];

  sortByOptions = [
    // // { label: "NONE", value: 'NONE' }, // Allows deselection by setting the value to null
    { label: "CityNameEng ", value: "CityNameEng" },
    { label: "District", value: "District" },
    { label: "Taluka", value: "Taluka" },
    { label: "Created At", value: "created_at" },
    { label: "Updated At", value: "updated_at" },
  ];

  sortOrderOptions = [
    // // { label: "NONE", value: 'NONE' }, // Allows deselection by setting the value to null
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];

  constructor(
    private cityMasterService: CityMasterService,
    private messageService: MessageService,
    private cityMasterStateService: CityMasterStateService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.breadcrumbItems = [
      { icon: "pi pi-fw pi-database", label: "Master Data", url: "/home" },
      { label: "CityMasters", url: "/md/citymasters" },
      { label: "List" },
    ];

    this.restoreStateAndLoadCityMasters();
  }

  restoreStateAndLoadCityMasters() {
    this.cityMasterStateService.getCityMasterListState().subscribe((state) => {
      console.log("CityMaster List State updated:", state);
      if (state) {
        this.filters = state.filters;
        this.currentPage = state.currentPage;
        this.perPage = state.perPage;
        this.selectedCityMasterId = state.selectedCityMasterId;
        this.navigatedFromListView = state.navigatedFromListView;
      }
    });
    this.loadCityMasters(); // Load citymasters with restored state
  }

  // exportToExcel() {
  //   const fileName = "citymasters.xlsx"; // Define the file name for the Excel export
  //   const excelData: any[] = this.citymaster; // Get the data to export

  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData); // Convert JSON data to Excel worksheet
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create a new Excel workbook
  //   XLSX.utils.book_append_sheet(wb, ws, "CityMasters"); // Add the worksheet to the workbook

  //   XLSX.writeFile(wb, fileName); // Write the workbook to a file and download it
  // }

  // exportToExcel() {
  //   const fileName = "citymasters.xlsx"; // Define the file name for the Excel export
  //   const excelData: any[] = this.citymaster.map((item) => {
  //     // Create a copy of the item object without the 'id' property
  //     const { id, DistrictMar, CityNameGmap, ...newItem } = item;
  //     return newItem;
  //   });

  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData); // Convert modified JSON data to Excel worksheet
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create a new Excel workbook
  //   XLSX.utils.book_append_sheet(wb, ws, "CityMasters"); // Add the worksheet to the workbook

  //   XLSX.writeFile(wb, fileName); // Write the workbook to a file and download it
  // }

  // exportToExcel() {
  //   this.confirmationService.confirm({
  //     message: "Are you sure you want to export data to Excel?",
  //     accept: () => {
  //       const fileName = "citymasters.xlsx"; // Define the file name for the Excel export
  //       const excelData = this.citymaster.map((item) => {
  //         // Create a copy of the item object without the 'id' property
  //         const { id, DistrictMar, CityNameGmap, ...newItem } = item;
  //         return newItem;
  //       });

  //       if (excelData.length > 0) {
  //         const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData); // Convert JSON data to Excel worksheet
  //         const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create a new Excel workbook
  //         XLSX.utils.book_append_sheet(wb, ws, "CityMasters"); // Add the worksheet to the workbook

  //         XLSX.writeFile(wb, fileName); // Write the workbook to a file and download it
  //       } else {
  //         console.error("No data available for export.");
  //         this.showError("No data available for export.");
  //       }
  //     },
  //     reject: () => {
  //       console.log("Export to Excel cancelled.");
  //     },
  //   });
  // }

  exportToExcel() {
    const fileName = "citymasters.xlsx"; // Define the file name for the Excel export

    // Call the exportCityMasters service method to get the data for export
    this.cityMasterService.exportCityMasters().subscribe(
      (response: any) => {
        if (response && Array.isArray(response.original)) {
          const excelData: any[] = response.original; // Extract the data from the response

          if (excelData.length > 0) {
            // Convert the data to an array of objects without certain properties (if needed)
            const modifiedData = excelData.map((item: any) => {
              // Create a copy of the item object without certain properties
              const { id, DistrictMar, CityNameGmap, ...newItem } = item;
              return newItem;
            });

            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(modifiedData); // Convert JSON data to Excel worksheet
            const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create a new Excel workbook
            XLSX.utils.book_append_sheet(wb, ws, "CityMasters"); // Add the worksheet to the workbook

            // Write the workbook to a file and download it
            XLSX.writeFile(wb, fileName);
          } else {
            console.error("No data available for export.");
            this.showError("No data available for export.");
          }
        } else {
          console.error("Invalid response data:", response);
          this.showError("Invalid response data. Unable to export to Excel.");
        }
      },
      (error: any) => {
        console.error("Error exporting citymasters for export:", error);
        this.showError("Error exporting citymasters to Excel.");
      }
    );
  }

  statusOptions = [
    // // { label: "NONE", value: 'NONE' }, // Allows deselection by setting the value to null
    // // { label: "REGISTERED", value: "REGISTERED" },
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  loadCityMasters(event?: any) {
    this.loading = true;

    let page = 1;
    let perPage = 10;

    if (event) {
      page =
        event.first !== undefined && event.rows
          ? event.first / event.rows + 1
          : 1;
      perPage = event.rows || 10;
    }

    const filtersForAPI = this.prepareFiltersForAPI();

    this.cityMasterService
      .getCityMasters(page, perPage, filtersForAPI)
      .subscribe(
        (response) => {
          console.log("Full API Response:", response);
          this.citymaster = response.data; // Assuming the data property holds the array of records
          this.totalRecords = response.total;
          this.loading = false;

          // Log success response to the console
          console.log("CityMasters loaded successfully:", response);
        },
        (error) => {
          console.error("Error fetching citymasters:", error);
          this.loading = false;

          // Log error response to the console
          console.error("CityMasters loading failed:", error);
        }
      );
  }

  prepareFiltersForAPI() {
    const filtersForAPI = { ...this.filters };

    // Date conversion for API
    if (filtersForAPI.created_from) {
      filtersForAPI.created_from.setHours(0, 0, 0, 0);
      filtersForAPI.created_from =
        filtersForAPI.created_from.toISOString().split()[0] + "T00:00:00.000";
    }
    if (filtersForAPI.created_to) {
      filtersForAPI.created_to.setHours(23, 59, 59, 999);
      filtersForAPI.created_to =
        filtersForAPI.created_to.toISOString().split()[0] + "T23:59:59.999";
    }
    // Similar conversion for updated_from and updated_to
    if (filtersForAPI.updated_from) {
      filtersForAPI.updated_from.setHours(0, 0, 0, 0);
      filtersForAPI.updated_from =
        filtersForAPI.updated_from.toISOString().split()[0] + "T00:00:00.000";
    }
    if (filtersForAPI.updated_to) {
      filtersForAPI.updated_to.setHours(23, 59, 59, 999);
      filtersForAPI.updated_to =
        filtersForAPI.updated_to.toISOString().split()[0] + "T23:59:59.999";
    }

    return filtersForAPI;
  }

  applyFilters() {
    console.log("Loading City Master after applying filters.");
    if (this.validateDates()) {
      this.loadCityMasters();
    }
  }

  resetFilters() {
    this.filters = {};
    this.loadCityMasters();
  }

  resetOneByOneFilters(): void {
    if (this.filters.CityNameEng !== "") {
      this.filters.CityNameEng = "";
      this.applyFilters();
    } else if (this.filters.District !== "") {
      this.filters.District = "";
      this.applyFilters();
    } else if (this.filters.Taluka !== "") {
      this.filters.Taluka = "";
      this.applyFilters();
    } else if (this.filters.Pincode !== "") {
      this.filters.Pincode = "";
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
      CityNameEng: "",
      District: "",
      Taluka: "",
      RouteNo: "",
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

  createNewRecord() {
    this.router.navigate(["/md/citymasters/create"]);
  }

  viewRecord() {
    console.log("testing click");

    if (this.selectedCityMasterId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true;

    // Handle the case where this.currentPage is null by providing a default value (e.g., 1).
    const currentPage = this.currentPage !== null ? this.currentPage : 1;

    this.cityMasterStateService.setCityMasterListState({
      filters: this.filters,
      currentPage: currentPage,
      perPage: this.perPage,
      selectedCityMasterId: this.selectedCityMasterId!,
      navigatedFromListView: this.navigatedFromListView,
    });

    this.router.navigate([`/md/citymasters/view/${this.selectedCityMasterId}`]);
  }

  editRecord() {
    if (this.selectedCityMasterId === null) {
      this.showError("Please select a citymaster to edit.");
      return;
    }
    this.router.navigate([`/md/citymasters/edit/${this.selectedCityMasterId}`]);
  }

  deactivateRecord() {
    if (this.selectedCityMasterId === null) {
      this.showError("Please select a citymaster to deactivate.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this citymaster?",
      accept: () => {
        if (typeof this.selectedCityMasterId === "number") {
          this.cityMasterService
            .deactivateCityMaster(this.selectedCityMasterId)
            .subscribe(
              () => {
                this.showSuccess("Citymaster deactivated successfully.");
                this.loadCityMasters({ first: 0, rows: 10 });
              },
              (error) => {
                this.showError("Error deactivating citymaster.");
                console.error("Deactivate Citymaster Error", error);
              }
            );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedCityMasterId === null) {
      this.showError("Please select a citymaster to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this citymaster?",
      accept: () => {
        if (typeof this.selectedCityMasterId === "number") {
          this.cityMasterService
            .deleteCityMaster(this.selectedCityMasterId)
            .subscribe(
              () => {
                this.showSuccess("Citymaster deleted successfully.");
                this.loadCityMasters({ first: 0, rows: 10 });
              },
              (error) => {
                this.showError("Error deleting citymaster.");
                console.error("Delete Citymaster Error", error);
              }
            );
        }
      },
    });
  }

  onRowSelect(event: any) {
    this.selectedCityMasterId = event.data.id;
  }

  showError(message: string) {
    this.messageService.add({
      severity: "warn",
      summary: "Warning",
      detail: message,
    });
    console.error("Error:", message);
  }

  resetCreatedDates() {
    this.filters.created_from = null;
    this.filters.created_to = null;
    this.applyFilters(); // You might want to re-apply filters here
  }

  resetUpdatedDates() {
    this.filters.updated_from = null;
    this.filters.updated_to = null;
    this.applyFilters(); // You might want to re-apply filters here
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: message,
    });
    console.log("Success:", message);
  }
}
