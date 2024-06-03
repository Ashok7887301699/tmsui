import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { Driver } from "./models/driver.model";
import { DriverService } from "./services/driver.service";
import { DriverStateService } from "./services/driver-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { UserContextService } from "../core/services/user-context.service";
import { ConfigService } from "../core/config/config.service";

@Component({
  selector: "app-driver-list",
  templateUrl: "./driver-list.component.html",
})
export class DriverListComponent implements OnInit {
  token: string | null = null;
  breadcrumbItems: MenuItem[] = [];
  drivers: Driver[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedDriverId: number | null = null;

  rowsPerPageOptions = [10, 20, 50, 100];
  perPage: number = this.rowsPerPageOptions[0];

  navigatedFromListView: boolean = false;

  // Dropdown options
  statusOptions = [
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  sortByOptions = [
    { label: "Name", value: "name" },
    { label: "Short Name", value: "short_name" },
    { label: "Status", value: "status" },
    { label: "Created At", value: "created_at" },
    { label: "Updated At", value: "updated_at" },
  ];

  sortOrderOptions = [
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];

  constructor(
    private driverService: DriverService,
    private messageService: MessageService,
    private driverStateService: DriverStateService,
    private confirmationService: ConfirmationService,
    private router: Router, // Inject Router
    private userContextService: UserContextService,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    const userContext = this.userContextService.getUserContext();
    if (userContext) {
      this.token = this.userContextService.getToken();
    }
    this.breadcrumbItems = [
      { icon: "pi pi-fw pi-database", label: "Master Data", url: "/home" },
      { label: "Drivers", url: "/md/drivermaster" },
      { label: "List" },
    ];

    this.restoreStateAndLoadDrivers();
  }

  ngOnChanges() {
    console.log("DriverListComponent: ngOnChanges");
  }

  ngOnDestroy() {
    console.log("DriverListComponent: ngOnDestroy");
  }

  restoreStateAndLoadDrivers() {
    this.driverStateService.getDriverListState().subscribe((state) => {
      console.log("Driver List State updated:", state);
      if (state) {
        this.filters = state.filters;
        this.currentPage = state.currentPage;
        this.perPage = state.perPage;
        this.selectedDriverId = state.selectedDriverId;
        this.navigatedFromListView = state.navigatedFromListView;
      }
    });
    this.loadDrivers();
  }

  loadDrivers(event?: any) {
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

    this.driverService
      .getDrivers(page, perPage, this.prepareFiltersForAPI())
      .subscribe(
        (response) => {
          this.drivers = response.data;
          this.totalRecords = response.total;
          this.loading = false;
        },
        (error) => {
          console.error("Error fetching drivers:", error);
          this.loading = false;
        }
      );
  }

  applyFilters() {
    console.log("Loading drivers after applying filters.");
    if (this.validateDates()) {
      this.loadDrivers();
    }
  }

  prepareFiltersForAPI() {
    const filtersForAPI = { ...this.filters };

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
    this.loadDrivers();
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
    this.router.navigate(["/md/drivermaster/create"]);
  }

  viewRecord() {
    if (this.selectedDriverId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true;

    this.driverStateService.setDriverListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedDriverId: this.selectedDriverId,
      navigatedFromListView: this.navigatedFromListView,
    });

    this.router.navigate([`/md/drivermaster/view/${this.selectedDriverId}`]);
  }

  editRecord() {
    if (this.selectedDriverId === null) {
      this.showError("Please select a driver to edit.");
      return;
    }

    this.router.navigate([`/md/drivermaster/edit/${this.selectedDriverId}`]);
  }

  deactivateRecord() {
    if (this.selectedDriverId === null) {
      this.showError("Please select a driver to deactivate.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this driver?",
      accept: () => {
        if (typeof this.selectedDriverId === "number") {
          this.driverService.deactivateDriver(this.selectedDriverId).subscribe(
            () => {
              this.showSuccess(
                `Driver with ID ${this.selectedDriverId} deactivated successfully`
              );
              this.loadDrivers();
            },
            (error) => this.showError("Error deactivating driver")
          );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedDriverId === null) {
      this.showError("Please select a driver to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this driver?",
      accept: () => {
        if (typeof this.selectedDriverId === "number") {
          this.driverService.deleteDriver(this.selectedDriverId).subscribe(
            () => {
              this.showSuccess(
                `Driver with ID ${this.selectedDriverId} deleted successfully`
              );
              this.loadDrivers();
            },
            (error) => this.showError("Error deleting driver")
          );
        }
      },
    });
  }

  onRowSelect(event: any) {
    this.selectedDriverId = event.data.id;
  }

  onRowUnselect(event: any) {
    this.selectedDriverId = null;
  }

  driverImageUrl(id: any): string {
    return `${
      this.configService.apiUrl + "/drivermaster/driverphoto/"
    }${id}?token=${this.token}`;
  }

  driverPanCardImageUrl(id: any): string {
    return `${
      this.configService.apiUrl + "/drivermaster/pancard/"
    }${id}?token=${this.token}`;
  }

  driverVoterIdImageUrl(id: any): string {
    return `${
      this.configService.apiUrl + "/drivermaster/voterid/"
    }${id}?token=${this.token}`;
  }

  driverAadharCardImageUrl(id: any): string {
    return `${
      this.configService.apiUrl + "/drivermaster/adharcard/"
    }${id}?token=${this.token}`;
  }

  driverLicenseImageUrl(id: any): string {
    return `${
      this.configService.apiUrl + "/drivermaster/License/"
    }${id}?token=${this.token}`;
  }
}
