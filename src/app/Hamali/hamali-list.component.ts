import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { Hamali } from "./models/hamali.model";
import { HamaliService } from "./services/hamali.service";
import { HamaliStateService } from "./services/hamali-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-hamali-list",
  templateUrl: "./hamali-list.component.html",
})
export class HamaliListComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  hamalis: Hamali[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedHamaliId: number | null = null;

  rowsPerPageOptions = [10, 20, 50, 100];
  perPage: number = this.rowsPerPageOptions[0];

  navigatedFromListView: boolean = false;

  // Dropdown options
  statusOptions = [
    // { label: "NONE", value: "NONE" },
    // { label: "REGISTERED", value: "REGISTERED" },
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  sortByOptions = [
    // { label: "None", value: "None" },
    { label: "VendorCode", value: "VendorCode" },
    { label: "Status", value: "status" },
    { label: "Created At", value: "created_at" },
    { label: "Updated At", value: "updatsed_at" },
  ];

  sortOrderOptions = [
    // { label: "None", value: "None" },
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];

  constructor(
    private hamaliService: HamaliService,
    private messageService: MessageService,
    private hamaliStateService: HamaliStateService,
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
      { label: "Hamali", routerLink: "/md/hamali" },
      { label: "List" },
    ];
    this.restoreStateAndLoadHamalis();
  }

  restoreStateAndLoadHamalis() {
    this.hamaliStateService.getHamaliListState().subscribe((state) => {
      if (state) {
        this.filters = state.filters;
        this.currentPage = state.currentPage;
        this.perPage = state.perPage;
        this.selectedHamaliId = state.selectedHamaliId;
        this.navigatedFromListView = state.navigatedFromListView;
      }
    });
    this.loadHamalis();
  }

  loadHamalis(event?: any) {
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

    this.hamaliService
      .getHamalis(page, perPage, this.prepareFiltersForAPI())
      .subscribe(
        (response: Hamali[] | any) => {
          if (Array.isArray(response)) {
            this.hamalis = response;
            this.totalRecords = response.length;
          } else {
            this.hamalis = response.data;
            this.totalRecords = response.total;
          }
          this.loading = false;
        },
        (error: any) => {
          console.error("Error fetching hamalis:", error);
          this.loading = false;
        }
      );
  }

  applyFilters() {
    // Validate and then load tenants
    console.log("Loading hamalis after applying filters.");
    if (this.validateDates()) {
      this.loadHamalis();
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
    this.loadHamalis();
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
    this.router.navigate(["/md/hamali/create"]);
  }

  viewRecord() {
    if (this.selectedHamaliId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true;
    this.hamaliStateService.setHamaliListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedHamaliId: this.selectedHamaliId,
      navigatedFromListView: this.navigatedFromListView,
    });

    this.router.navigate([`/md/hamali/view/${this.selectedHamaliId}`]);
  }

  editRecord() {
    if (this.selectedHamaliId === null) {
      this.showError("Please select a Hamali to edit.");
      return;
    }

    this.router.navigate([`/md/hamali/edit/${this.selectedHamaliId}`]);
  }

  deactivateRecord() {
    if (this.selectedHamaliId === null) {
      this.showError("Please select a Hamali to deactivate.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this Hamali?",
      accept: () => {
        if (typeof this.selectedHamaliId === "number") {
          this.hamaliService.deactivateHamali(this.selectedHamaliId).subscribe(
            () => {
              this.showSuccess(
                `Hamali with ID ${this.selectedHamaliId} deactivated successfully`
              );
              this.loadHamalis();
            },
            (error: any) => this.showError("Error deactivating Hamali")
          );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedHamaliId === null) {
      this.showError("Please select a Hamali to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this Hamali?",
      accept: () => {
        if (typeof this.selectedHamaliId === "number") {
          this.hamaliService.deleteHamali(this.selectedHamaliId).subscribe(
            () => {
              this.showSuccess(
                `Hamali with ID ${this.selectedHamaliId} deleted successfully`
              );
              this.loadHamalis();
            },
            (error: any) => this.showError("Error deleting hamali")
          );
        }
      },
    });
  }

  onRowSelect(event: any) {
    this.selectedHamaliId = event.data.id;
  }

  onRowUnselect(event: any) {
    this.selectedHamaliId = null;
  }
}