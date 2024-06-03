import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { VehicleCapacityModel } from "./models/vehiclecapacitymodel.model";
import { VehiclecapacitymodelService } from "./services/vehiclecapacitymodel.service";
import { VehiclecapacitymodelStateService } from "./services/vehiclecapacitymodel-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-vehiclecapacitymodel-list",
  templateUrl: "./vehiclecapacitymodel-list.component.html",
})
export class VehiclecapacitymodelListComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  vehiclecapacitymodels: VehicleCapacityModel[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedVehicleCapacityModelId: number | null = null;

  rowsPerPageOptions = [10, 20, 50, 100];
  perPage: number = this.rowsPerPageOptions[0];

  navigatedFromListView: boolean = false;

  // Dropdown options
  statusOptions = [
    // { label: "NONE", value: "NONE" },
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  sortByOptions = [
    // { label: "NONE", value: "NONE" },
    { label: "Vehicle Capacity Model", value: "vehcpctmodel" },
    { label: "Vehicle Capacity Model", value: "vehiclecpct" },
    { label: "Model Discription", value: "modeldesc" },
    { label: "Status", value: "status" },
    { label: "Created At", value: "created_at" },
    { label: "Updated At", value: "updated_at" },
  ];

  sortOrderOptions = [
    // { label: "NONE", value: "NONE" },
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];

  constructor(
    private vehiclecapacitymodelService: VehiclecapacitymodelService,
    private messageService: MessageService,
    private vehiclecapacitymodelStateService: VehiclecapacitymodelStateService,
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
      {
        label: "Vehicle Capacity Model",
        routerLink: "/md/Vehiclecapacitymodel",
      },
      { label: "List" },
    ];
    console.log("VehiclecapacitymodelListComponent: ngOnInit");
    // Load VehicleCapacityModel on init and restore state if available
    this.restoreStateAndLoadVehicleCapacityModels();
  }

  ngOnChanges() {
    console.log("VehiclecapacitymodelListComponent: ngOnChanges");
  }

  ngOnDestroy() {
    console.log("VehiclecapacitymodelListComponent: ngOnDestroy");
    // Unsubscribe from subscriptions if any
  }

  restoreStateAndLoadVehicleCapacityModels() {
    this.vehiclecapacitymodelStateService
      .getVehiclecapacitymodelListState()
      .subscribe((state) => {
        console.log("Vehicle Capacity Model List State updated:", state);
        if (state) {
          this.filters = state.filters;
          this.currentPage = state.currentPage;
          this.perPage = state.perPage;
          this.selectedVehicleCapacityModelId =
            state.selectedVehiclecapacitymodelId;
          this.navigatedFromListView = state.navigatedFromListView;
        }
      });
    this.loadVehicleCapacityModels();
  }

  loadVehicleCapacityModels(event?: any) {
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

    this.vehiclecapacitymodelService
      .getVehicleCapacityModels(page, perPage, this.prepareFiltersForAPI())
      .subscribe(
        (response: VehicleCapacityModel[] | any) => {
          if (Array.isArray(response)) {
            this.vehiclecapacitymodels = response;
            this.totalRecords = response.length;
          } else {
            this.vehiclecapacitymodels = response.data;
            this.totalRecords = response.total;
          }
          this.loading = false;
        },
        (error: any) => {
          console.error("Error fetching vehiclecapacitymodels:", error);
          this.loading = false;
        }
      );
  }

  applyFilters() {
    console.log("Loading Vehicle Capacity Model after applying filters.");
    if (this.validateDates()) {
      this.loadVehicleCapacityModels();
    }
  }
  resetOneByOneFilters(): void {
    if (this.filters.modeldesc !== "") {
      this.filters.modeldesc = "";
      this.applyFilters();
    } else if (this.filters.vehcpctmodel !== "") {
      this.filters.vehcpctmodel = "";
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
      vehcpctmodel: "",
      modeldesc: "",
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
    this.loadVehicleCapacityModels();
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
    this.router.navigate(["/md/vehiclecapacitymodel/create"]);
  }

  viewRecord() {
    if (this.selectedVehicleCapacityModelId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true;
    this.vehiclecapacitymodelStateService.setVehiclecapacitymodelListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedVehiclecapacitymodelId: this.selectedVehicleCapacityModelId,
      navigatedFromListView: this.navigatedFromListView,
    });

    this.router.navigate([
      `/md/vehiclecapacitymodel/view/${this.selectedVehicleCapacityModelId}`,
    ]);
  }

  editRecord() {
    if (this.selectedVehicleCapacityModelId === null) {
      this.showError("Please select a vehiclecapacitymodel to edit.");
      return;
    }

    this.router.navigate([
      `/md/vehiclecapacitymodel/edit/${this.selectedVehicleCapacityModelId}`,
    ]);
  }

  deactivateRecord() {
    if (this.selectedVehicleCapacityModelId === null) {
      this.showError("Please select a  Vehicle Capacity Model to deactivate.");
      return;
    }

    this.confirmationService.confirm({
      message:
        "Are you sure you want to deactivate this Vehicle Capacity Model?",
      accept: () => {
        if (typeof this.selectedVehicleCapacityModelId === "number") {
          this.vehiclecapacitymodelService
            .deactivateVehicleCapacityModel(this.selectedVehicleCapacityModelId)
            .subscribe(
              () => {
                this.showSuccess(
                  `VehicleCapacityModel with ID ${this.selectedVehicleCapacityModelId} deactivated successfully`
                );
                this.loadVehicleCapacityModels();
              },
              (error: any) =>
                this.showError("Error deactivating  Vehicle Capacity Model")
            );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedVehicleCapacityModelId === null) {
      this.showError("Please select a  Vehicle Capacity Model to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this  Vehicle Capacity Model?",
      accept: () => {
        if (typeof this.selectedVehicleCapacityModelId === "number") {
          this.vehiclecapacitymodelService
            .deleteVehicleCapacityModel(this.selectedVehicleCapacityModelId)
            .subscribe(
              () => {
                this.showSuccess(
                  ` Vehicle Capacity Model with ID ${this.selectedVehicleCapacityModelId} deleted successfully`
                );
                this.loadVehicleCapacityModels();
              },
              (error: any) =>
                this.showError("Error deleting  Vehicle Capacity Model")
            );
        }
      },
    });
  }

  onRowSelect(event: any) {
    this.selectedVehicleCapacityModelId = event.data.id;
  }

  onRowUnselect(event: any) {
    this.selectedVehicleCapacityModelId = null;
  }
}
