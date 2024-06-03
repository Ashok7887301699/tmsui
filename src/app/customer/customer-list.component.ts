import { Component, OnInit } from "@angular/core";
import { CustomerService } from "./services/customer.service";
import { CustomerStateService } from "./services/customer-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { MessageService } from "primeng/api";
import { customer } from "./models/customer.model"; // Importing Customer model
import * as XLSX from "xlsx"; // Import XLSX library for Excel export
@Component({
  selector: "app-customer-list",
  templateUrl: "./customer-list.component.html", // Template file path
  styles: ` .value {
    margin-left: 0; /* Remove left margin */
  }`, // Empty styles for now
})
export class CustomerListComponent implements OnInit {
  breadcrumbItems: MenuItem[] = []; // Array to hold breadcrumb items
  customers: customer[] = []; // Array to hold customer data
  totalRecords: number = 0; // Total number of records
  currentPage: number = 1; // Current page number
  filters: any = {}; // Object to hold filters
  loading: boolean = false; // Loading indicator
  selectedSapCustCode: string | null = null; // Selected customer

  rowsPerPageOptions = [10, 20, 50, 100]; // Options for rows per page
  perPage: number = this.rowsPerPageOptions[0]; // Default rows per page

  navigatedFromListView: boolean = false; // Flag to track navigation

  // Dropdown options
  statusOptions = [
    // // { label: "NONE", value: "NONE" },
    { label: "ACTIVE", value: "1" },
    { label: "DEACTIVATED", value: "0" },
  ];

  sortByOptions = [
    // { label: "NONE", value: "NONE" },
    { label: "sap_cust_code", value: "sap_cust_code" },
    { label: "sap_cust_grp_code", value: "sap_cust_grp_code" },
    { label: "CustName", value: "CustName" },
    { label: "Status", value: "Status" },
    { label: "Created At", value: "created_at" },
    { label: "Updated At", value: "updated_at" },
  ];

  sortOrderOptions = [
    // { label: "NONE", value: "NONE" },
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];

  // Constructor with dependency injections
  constructor(
    private customerService: CustomerService, // Customer service
    private messageService: MessageService, // Message service
    private customerStateService: CustomerStateService, // Customer state service
    private confirmationService: ConfirmationService, // Confirmation service
    private router: Router // Router service
  ) {}

  // Angular lifecycle hook - ngOnInit
  ngOnInit() {
    // Set breadcrumb items
    this.breadcrumbItems = [
      {
        icon: "pi pi-fw pi-database",
        label: "Master Data",
        routerLink: "/home",
      },
      { label: "Customers", routerLink: "/md/customers" },
      { label: "List" },
    ];

    console.log("CustomerListComponent: ngOnInit");
    // Load tenants on init and restore state if available
    this.restoreStateAndLoadCustomers();
  }

  ngOnChanges() {
    console.log("CustomerListComponent: ngOnChanges");
  }

  ngOnDestroy() {
    console.log("CustomerListComponent: ngOnDestroy");
    // Unsubscribe from subscriptions if any
  }

  // Function to restore state and load customers
  restoreStateAndLoadCustomers() {
    this.customerStateService.getCustomerListState().subscribe((state) => {
      console.log("Customer List State updated:", state);
      if (state) {
        this.filters = state.filters;
        this.currentPage = state.currentPage;
        this.perPage = state.perPage;
        this.selectedSapCustCode = state.selectedSapCustCode;
        this.navigatedFromListView = state.navigatedFromListView;
      }
    });

    // Load customers
    this.loadCustomers();
  }

  // Function to load customers
  loadCustomers(event?: any) {
    this.loading = true;
    let page = this.currentPage || 1;
    let perPage = 10;

    if (event) {
      page =
        event.first !== undefined && event.rows
          ? event.first / event.rows + 1
          : 1;
      perPage = event.rows || 10;
    }

    this.customerService
      .getCustomers(page, perPage, this.prepareFiltersForAPI())
      .subscribe(
        (response) => {
          if (
            response.customer &&
            response.customer.data &&
            response.customer.total
          ) {
            this.customers = response.customer.data;
            this.totalRecords = response.customer.total;
          } else {
            // Handle unexpected response structure
            console.error("Unexpected response structure:", response);
            // Reset customers and totalRecords to handle the error gracefully
            this.customers = [];
            this.totalRecords = 0;
          }
          this.loading = false;
        },
        (error: any) => {
          console.error("Error fetching customers:", error);
          this.loading = false;
        }
      );
  }

  // Function to apply filters
  applyFilters() {
    console.log("Loading customers after applying filters.");
    if (this.validateDates()) {
      this.loadCustomers();
    }
  }
  resetOneByOneFilters(): void {
    if (this.filters.CustName !== "") {
      this.filters.CustName = "";
      this.applyFilters();
    } else if (this.filters.sap_cust_grp_code !== "") {
      this.filters.sap_cust_grp_code = "";
      this.applyFilters();
    } else if (this.filters.sap_cust_code !== "") {
      this.filters.sap_cust_code = "";
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
    } else if (this.filters.sap_create_date_from !== null) {
      this.filters.sap_create_date_from = null;
      this.applyFilters();
    } else if (this.filters.sap_create_date_to !== null) {
      this.filters.sap_create_date_to = null;
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
      sap_cust_code: "",
      sap_cust_grp_code: "",
      CustName: "",
      Status: null,
      created_from: null,
      created_to: null,
      updated_from: null,
      updated_to: null,
      sap_create_date_from: null,
      sap_create_date_to: null,
      sort_by: null,
      sort_order: null,
    };

    // After resetting filters, apply them.
    this.applyFilters();
  }

  // Function to prepare filters for API
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

    // Date conversion for API
    if (filtersForAPI.sap_create_date_from) {
      filtersForAPI.sap_create_date_from.setHours(0, 0, 0, 0);
      filtersForAPI.sap_create_date_from =
        filtersForAPI.sap_create_date_from.toISOString().split()[0] +
        "T00:00:00.000";
    }
    if (filtersForAPI.sap_create_date_to) {
      filtersForAPI.sap_create_date_to.setHours(23, 59, 59, 999);
      filtersForAPI.sap_create_date_to =
        filtersForAPI.sap_create_date_to.toISOString().split()[0] +
        "T23:59:59.999";
    }

    return filtersForAPI;
  }

  // Function to validate dates
  validateDates() {
    const {
      created_from,
      created_to,
      updated_from,
      updated_to,
      sap_create_date_to,
      sap_create_date_from,
    } = this.filters;

    if ((created_from && !created_to) || (!created_from && created_to)) {
      this.showError("Both Created From and Created To dates are required.");
      return false;
    }
    if (created_from && created_to && created_to < created_from) {
      this.showError("Created To date must be after Created From date.");
      return false;
    }

    if (
      (sap_create_date_from && !sap_create_date_to) ||
      (!sap_create_date_from && sap_create_date_to)
    ) {
      this.showError(
        "Both Sap Create From and Sap Created To dates are required."
      );
      return false;
    }
    if (
      sap_create_date_from &&
      sap_create_date_to &&
      sap_create_date_to < sap_create_date_from
    ) {
      this.showError(
        " Sap Created To date must be after Sap Created From date."
      );
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

  // Function to reset filters
  resetFilters() {
    this.filters = {};
    this.loadCustomers();
  }

  // Function to reset created dates
  resetCreatedDates() {
    this.filters.created_from = null;
    this.filters.created_to = null;
    this.applyFilters();
  }

  // Function to reset updated dates
  resetUpdatedDates() {
    this.filters.updated_from = null;
    this.filters.updated_to = null;
    this.applyFilters();
  }
  resetSapDates() {
    this.filters.sap_create_date_from = null;
    this.filters.sap_create_date_to = null;
    this.applyFilters();
  }
  // Function to show success message
  showSuccess(message: string) {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: message,
    });
  }

  // Function to show error message
  showError(message: string) {
    this.messageService.add({
      severity: "warn",
      summary: "Warning",
      detail: message,
    });
  }

  // Function to create a new record
  createNewRecord() {
    this.router.navigate(["/md/customers"]);
  }

  // Function to view a record
  viewRecord() {
    if (!this.selectedSapCustCode) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true;
    this.customerStateService.setCustomerListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedSapCustCode: this.selectedSapCustCode,
      navigatedFromListView: this.navigatedFromListView,
    });

    this.router.navigate([`/md/customers/view/${this.selectedSapCustCode}`]);
  }

  // Function to edit a record
  editRecord() {
    if (!this.selectedSapCustCode) {
      this.showError("Please select a customer to edit.");
      return;
    }

    this.router.navigate([`/md/customers/edit/${this.selectedSapCustCode}`]);
  }

  deactivateRecord() {
    if (!this.selectedSapCustCode) {
      this.showError("Please select a customer to deactivate.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this Customer?",
      accept: () => {
        // Ensure selectedSapCustCode is a string

        // Check if sap_cust_code is empty
        if (
          typeof this.selectedSapCustCode !== "string" ||
          this.selectedSapCustCode.trim() === ""
        ) {
          this.showError("Invalid SAP customer code.");
          return;
        }
        console.log("sap_cust_code", this.selectedSapCustCode);
        this.customerService
          .deactivateCustomer(this.selectedSapCustCode)
          .subscribe(
            () => {
              this.showSuccess(
                `Customer with ID ${this.selectedSapCustCode} deactivated successfully`
              );
              this.loadCustomers();
            },
            (error: any) => this.showError("Error deactivating customer")
          );
      },
    });
  }

  // Function to delete a record
  deleteRecord() {
    if (!this.selectedSapCustCode) {
      this.showError("Please select a customer to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this customer?",
      accept: () => {
        if (this.selectedSapCustCode) {
          // Check if selectedSapCustCode is not null
          this.customerService
            .deleteCustomer(this.selectedSapCustCode)
            .subscribe(
              () => {
                this.showSuccess(
                  `Customer with ID ${this.selectedSapCustCode} deleted successfully`
                );
                this.loadCustomers();
              },
              (error: any) => this.showError("Error deleting customer")
            );
        }
      },
    });
  }

  // Function triggered when a row is selected
  onRowSelect(event: any) {
    this.selectedSapCustCode = event.data.sap_cust_code;
    console.log("onrow select", this.selectedSapCustCode);
  }

  // Function triggered when a row is unselected
  onRowUnselect(event: any) {
    this.selectedSapCustCode = null;
  }

  
  exportToExcel() {
    const fileName = "customermaster.xlsx"; // Define the file name for the Excel export
    const excelData: any[] = this.customers.map((item) => {
      // Create a copy of the item object without the 'id' property
      const { cust_grp_code, ind_type_id, depot_id, ...newItem } = item;
      return newItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData); // Convert modified JSON data to Excel worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create a new Excel workbook
    XLSX.utils.book_append_sheet(wb, ws, "customer"); // Add the worksheet to the workbook

    XLSX.writeFile(wb, fileName); // Write the workbook to a file and download it
  }
}
