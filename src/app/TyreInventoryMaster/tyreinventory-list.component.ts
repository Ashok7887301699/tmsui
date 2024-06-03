import { Tyreinventory } from './models/tyreinventory.model';
import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { TyreinventoryService } from "./services/tyreinventory.service";
import { TyreinventoryStateService } from "./services/tyreinventory-state.service";

@Component({
  selector: 'app-tyreinventory-list',
  templateUrl:'./tyreinventory-list.component.html',
  
})
export class TyreinventoryListComponent implements OnInit{
  breadcrumbItems: MenuItem[] = [];
  tyreinventory: Tyreinventory[] = [] ;
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedTyreId: number | null |undefined= null;
// Changed from selectedTenant to selectedTyreId
  // showClear: boolean = true;
  rowsPerPageOptions = [10, 20, 50, 100];
  perPage: number = this.rowsPerPageOptions[0];

  navigatedFromListView: boolean = false;

  // Dropdown options
  statusOptions = [
    
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  // Dropdown options
  TyreStatusOptions = [
    
    { label: "Brand New", value: "Brand New" },
    { label: "In Use", value: "In Use" },
    { label: "Scrap", value: "Scrap" },
  ];

  sortByOptions = [
    { label: "Tyre Number", value: "tyre_number" },
    { label: "Manufacturer", value: "manufacturer" },
    { label: "price", value: "price" },
    { label: "Status", value: "status" },
    { label: "Created At", value: "created_at" },
    { label: "Updated At", value: "updated_at" },
  ];

  sortOrderOptions = [
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];
  value: any;

  constructor(
   
    private messageService: MessageService,
    private TyreinventoryService:TyreinventoryService, // Add this
    private TyreinventoryStateService:TyreinventoryStateService, // Add this
    private confirmationService: ConfirmationService,
    private router: Router // Inject Router
  ) {this.selectedTyreId = null;}

  ngOnInit() {
    this.breadcrumbItems = [
      { icon: "pi pi-fw pi-database", label: "Master Data", url: "/home" },
      { label: "Tyre Inventory", url: "/md/tyreinventory" },
      { label: "List" }, // Current page, no URL
    ];
    console.log("TyreinventoryListComponent: ngOnInit");
    // Load tenants on init and restore state if available
    this.restoreStateAndTyreInventoryData();
  }

  ngOnChanges() {
    console.log("TyreinventoryListComponent: ngOnChanges");
  }

  ngOnDestroy() {
    console.log("TyreinventoryListComponent: ngOnDestroy");
    // Unsubscribe from subscriptions if any
  }

  restoreStateAndTyreInventoryData() {
    this.TyreinventoryStateService.gettyreinventoryListState().subscribe((state) => {
      console.log("Tyre Inventory List State updated:", state);
      if (state) {
        this.filters = state.filters;
        this.currentPage = state.currentPage;
        this.perPage = state.perPage;
        this.selectedTyreId = state.selectedTyreId;
        this.navigatedFromListView = state.navigatedFromListView;
      }
    });
    this.loadTyreInventoryData(); // Load tenants with restored state
  }
  loadTyreInventoryData(event?: any) {
    this.loading = true;
    let page = this.currentPage || 1;
    let perPage = 10;
  
    if (event) {
      page = event.first !== undefined && event.rows ? event.first / event.rows + 1 : 1;
      perPage = event.rows || 10;
    }
    this.TyreinventoryService
      .gettyreinventory(page, perPage, this.prepareFiltersForAPI())
      .subscribe(
        (response: Tyreinventory[] | any) => {
          if (Array.isArray(response)) {
            this.tyreinventory = response;
            this.totalRecords = response.length;
          } else {
            this.tyreinventory = response.data;
            this.totalRecords = response.total;
          }
          this.loading = false;
        },
        (error: any) => {
          console.error("Error fetching tyreinventory:", error);
          this.loading = false;
        }
      );
  }
  applyFilters() {
    // Validate and then load Tyre Inventory
    console.log("Loading Tyre Inventory after applying filters.");
    if (this.validateDates()) {
      this.loadTyreInventoryData();
    }
  }
  resetOneByOneFilters(): void {
    if (this.filters.tyre_number !== "") {
      this.filters.tyre_number = "";
      this.applyFilters();
    } else if (this.filters.tyre_code !== "") {
      this.filters.tyre_code = "";
      this.applyFilters();
    } else if (this.filters.Status !== null) {
      this.filters.Status = null;
      this.applyFilters();
    } else if (this.filters.tyre_status !== null) {
      this.filters.tyre_status = null;
      this.applyFilters();
    }else if (this.filters.created_from !== null) {
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
      tyre_status: "",
      tyre_number: "",
      tyre_code: "",
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
    if (filtersForAPI.purchase_date_from) {
      filtersForAPI.purchase_date_from.setHours(0, 0, 0, 0);
      filtersForAPI.purchase_date_from =
        filtersForAPI.purchase_date_from.toISOString().split()[0] + "T00:00:00.000";
    }
    if (filtersForAPI.purchase_date_to) {
      filtersForAPI.purchase_date_to.setHours(23, 59, 59, 999);
      filtersForAPI.purchase_date_to =
        filtersForAPI.purchase_date_to.toISOString().split()[0] + "T23:59:59.999";
    }
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

  validateDates() {
    const { purchase_date_from, purchase_date_to, created_from, created_to, updated_from, updated_to } = this.filters;

    if ((purchase_date_from && !purchase_date_to) || (!purchase_date_from && purchase_date_to)) {
      this.showError("Both Purchase Date From and Purchase Date To dates are required.");
      return false;
    }
    if (purchase_date_from && purchase_date_to && purchase_date_to < purchase_date_from) {
      this.showError("Created To date must be after Created From date.");
      return false;
    }
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
    this.loadTyreInventoryData();
  }

  resetCreatedDates() {
    this.filters.purchase_date_from = null;
    this.filters.purchase_date_to = null;
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
  }

  showError(message: string) {
    this.messageService.add({
      severity: "warn",
      summary: "Warning",
      detail: message,
    });
  }

  createNewRecord() {
    // Navigate to the 'create' route
    this.router.navigate(["/md/tyreinventory/create"]);
  }

  viewRecord() {
    if (this.selectedTyreId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true; // Set the flag before navigating
    // Save the current state before navigating
    this.TyreinventoryStateService.settyreinventoryListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedTyreId: this.selectedTyreId,
      navigatedFromListView: this.navigatedFromListView,
      // selectedTenantId: null
    });

    // Navigate to the view page
    this.router.navigate([`/md/tyreinventory/view/${this.selectedTyreId}`]);
  }

  editRecord() {
    if (this.selectedTyreId === null) {
      this.showError("Please select a tenant to edit.");
      return;
    }

    // Navigate to the 'edit' route with the selected tenant's ID
    this.router.navigate([`/md/tyreinventory/edit/${this.selectedTyreId}`]);
  }

  deactivateRecord() {
    if (this.selectedTyreId === null) {
      this.showError("Please select a tenant to deactivate.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this tenant?",
      accept: () => {
        // Ensure selectedTyreId is a number before calling the service
        if (typeof this.selectedTyreId === "number") {
          this.TyreinventoryService.deactivatetyreinventory(this.selectedTyreId).subscribe(
            () => {
              this.showSuccess(
                `Tyre Inventory with ID ${this.selectedTyreId} deactivated successfully`
              );
              this.loadTyreInventoryData(); // Refresh the list
            },
            (error) => this.showError("Error deactivating tenant")
          );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedTyreId === null) {
      this.showError("Please select a Tyre  to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this Tyre?",
      accept: () => {
        // Ensure selectedTyreId is a number before calling the service
        if (typeof this.selectedTyreId === "number") {
          this.TyreinventoryService.deletetyreinventory(this.selectedTyreId).subscribe(
            () => {
              this.showSuccess(
                `Tyre with ID ${this.selectedTyreId} deleted successfully`
              );
              this.loadTyreInventoryData(); // Refresh the list
            },
            (error) => this.showError("Error deleting Tyre")
          );
        }
      },
    });
  }

  onRowSelect(event: any) {
    // Set the selected tenant ID when a row is selected
    this.selectedTyreId = event.data.id;
  }

  onRowUnselect(event: any) {
    // Reset the selected tenant ID when a row is unselected
    this.selectedTyreId = null;
  }

}
