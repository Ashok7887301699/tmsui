import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { Vehicle } from "./models/vehicle.model";
import { VehicleService } from "./services/vehicle.service";
import { VehicleStateService } from "./services/vehicle-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-vehicle-list",
  templateUrl: "./vehicle-list.component.html",
  styles: ``,
})
export class VehicleListComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  vehicle: Vehicle[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedVehicleId: number | null = null; // Changed from selectedTenant to selectedTenantId

  rowsPerPageOptions = [10, 20, 50, 100];
  perPage: number = this.rowsPerPageOptions[0];

  navigatedFromListView: boolean = false;

  // Dropdown options
  statusOptions = [
    // { label: "NONE", value: "NONE" }, // Allows deselection by setting the value to null
    { label: "ACTIVE", value: "1" },
    { label: "DEACTIVATED", value: "0" },
  ];

  sortByOptions = [
    // { label: "NONE", value: "NONE" }, // Allows deselection by setting the value to null
    { label: "VehicleType", value: "VehicleType" },
    { label: "Vehicle_No ", value: "Vehicle_No" },
    { label: "VendorName", value: "VendorName" },
    { label: "ActiveFlag", value: "ActiveFlag" },
    { label: "Created At", value: "created_at" },
    { label: "Updated At", value: "updated_at" },
  ];

  sortOrderOptions = [
    // { label: "NONE", value: "NONE" }, // Allows deselection by setting the value to null
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];

  constructor(
    private VehicleService: VehicleService,
    private messageService: MessageService,
    private VehicleStateService: VehicleStateService, // Add this
    private confirmationService: ConfirmationService,
    private router: Router // Inject Router
  ) {}

  ngOnInit() {
    this.breadcrumbItems = [
      { icon: "pi pi-fw pi-database", label: "Master Data", url: "/home" },
      { label: "vehicle", url: "/md/vehicle" },
      { label: "List" }, // Current page, no URL
    ];
    console.log("VehicleListComponent: ngOnInit");
    // Load tenants on init and restore state if available
    this.restoreStateAndLoadVehicles();
  }

  ngOnChanges() {
    console.log("VehicleListComponent: ngOnChanges");
  }

  ngOnDestroy() {
    console.log("VehicleListComponent: ngOnDestroy");
    // Unsubscribe from subscriptions if any
  }

  applyFilters() {
    // Validate and then load tenants
    console.log("Loading tenants after applying filters.");
    if (this.validateDates()) {
      this.loadVehicles();
    }
  }
  resetOneByOneFilters(): void {
    if (this.filters.VendorName !== "") {
      this.filters.VendorName = "";
      this.applyFilters();
    } else if (this.filters.Vehicle_No !== "") {
      this.filters.Vehicle_No = "";
      this.applyFilters();
    } else if (this.filters.VehicleType !== "") {
      this.filters.VehicleType = "";
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
      VendorName: "",
      Vehicle_No: "",
      VehicleType: "",
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
  restoreStateAndLoadVehicles() {
    this.VehicleStateService.getVehicleListState().subscribe((state) => {
      console.log("Vehicle List State updated:", state);
      if (state) {
        this.filters = state.filters;
        this.currentPage = state.currentPage;
        this.perPage = state.perPage;
        this.selectedVehicleId = state.selectedVehicleId;
        this.navigatedFromListView = state.navigatedFromListView;
      }
    });
    this.loadVehicles(); // Load tenants with restored state
  }

  loadVehicles(event?: any) {
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

    this.VehicleService.getVehicle(
      page,
      perPage,
      this.prepareFiltersForAPI()
    ).subscribe(
      (response) => {
        if (response && response.vehicle.data && response.vehicle.total) {
          this.vehicle = response.vehicle.data;
          this.totalRecords = response.vehicle.total;
          console.log("response fetched data", this.vehicle);
        } else {
          console.error("Unexpected response structure:", response);
          // Reset customers and totalRecords to handle the error gracefully
          this.vehicle = [];
          this.totalRecords = 0;
        }
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching vehicle:", error);
        this.loading = false;
      }
    );
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
    this.loadVehicles();
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
    this.router.navigate(["/md/vehicle/create"]);
  }

  viewRecord() {
    if (this.selectedVehicleId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true; // Set the flag before navigating
    // Save the current state before navigating
    this.VehicleStateService.setVehicleListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedVehicleId: this.selectedVehicleId,
      navigatedFromListView: this.navigatedFromListView,
    });

    // Navigate to the view page
    this.router.navigate([`/md/vehicle/view/${this.selectedVehicleId}`]);
  }

  editRecord() {
    if (this.selectedVehicleId === null) {
      this.showError("Please select a vehicle to edit.");
      return;
    }

    // Navigate to the 'edit' route with the selected tenant's ID
    this.router.navigate([`/md/vehicle/edit/${this.selectedVehicleId}`]);
  }

  deactivateRecord() {
    if (this.selectedVehicleId === null) {
      this.showError("Please select a vehicle to deactivate.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this vehicle?",
      accept: () => {
        // Ensure selectedTenantId is a number before calling the service
        if (typeof this.selectedVehicleId === "number") {
          this.VehicleService.deactivateVehicle(
            this.selectedVehicleId
          ).subscribe(
            () => {
              this.showSuccess(
                `vehicle with ID ${this.selectedVehicleId} deactivated successfully`
              );
              this.loadVehicles(); // Refresh the list
            },
            (error) => this.showError("Error deactivating vehicle")
          );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedVehicleId === null) {
      this.showError("Please select a vehicle to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this vehicle?",
      accept: () => {
        // Ensure selectedTenantId is a number before calling the service
        if (typeof this.selectedVehicleId === "number") {
          this.VehicleService.deleteVehicle(this.selectedVehicleId).subscribe(
            () => {
              this.showSuccess(
                `vehicle with ID ${this.selectedVehicleId} deleted successfully`
              );
              this.loadVehicles(); // Refresh the list
            },
            (error) => this.showError("Error deleting tenant")
          );
        }
      },
    });
  }

  onRowSelect(event: any) {
    // Set the selected tenant ID when a row is selected
    this.selectedVehicleId = event.data.SrNo;
  }

  onRowUnselect(event: any) {
    // Reset the selected tenant ID when a row is unselected
    this.selectedVehicleId = null;
  }

  // Additional methods as needed...
}
