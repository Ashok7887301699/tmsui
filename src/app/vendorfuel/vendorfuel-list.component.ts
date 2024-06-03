import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { VendorFuel } from "./models/vendorfuel.model";
import { vendorfuelService } from "./services/vendorfuel.service";
import { VendorfuelStateService } from "./services/vendorfuel-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-vendorfuel-list",
  templateUrl: "./vendorfuel-list.component.html",
})
export class VendorfuelListComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  vendorfuels: VendorFuel[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedVendorFuelId: number | null = null;

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
    { label: "PetrolPumpName", value: "PetrolPumpName" },
    { label: "DVendorCode", value: "DVendorCode" },
    { label: "Vendorname", value: "Vendorname" },
    { label: "Status", value: "status" },
    { label: "Created At", value: "created_at" },
    { label: "Updated At", value: "updated_at" },
  ];

  sortOrderOptions = [
    // { label: "None", value: "None" },
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];

  constructor(
    private vendorfuelService: vendorfuelService,
    private messageService: MessageService,
    private vendorfuelStateService: VendorfuelStateService,
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
      { label: "VendorFuel", routerLink: "/md/vendorfuel" },
      { label: "List" },
    ];
    this.restoreStateAndLoadVendorFuels();
  }

  restoreStateAndLoadVendorFuels() {
    this.vendorfuelStateService.getVendorFuelListState().subscribe((state) => {
      if (state) {
        this.filters = state.filters;
        this.currentPage = state.currentPage;
        this.perPage = state.perPage;
        this.selectedVendorFuelId = state.selectedVendorFuelId;
        this.navigatedFromListView = state.navigatedFromListView;
      }
    });
    this.loadVendorFuels();
  }

  loadVendorFuels(event?: any) {
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

    this.vendorfuelService
      .getVendorFuels(page, perPage, this.prepareFiltersForAPI())
      .subscribe(
        (response: VendorFuel[] | any) => {
          if (Array.isArray(response)) {
            this.vendorfuels = response;
            this.totalRecords = response.length;
          } else {
            this.vendorfuels = response.data;
            this.totalRecords = response.total;
          }
          this.loading = false;
        },
        (error: any) => {
          console.error("Error fetching vendorfuels:", error);
          this.loading = false;
        }
      );
  }

  applyFilters() {
    // Validate and then load tenants
    console.log("Loading VendorFuels after applying filters.");
    if (this.validateDates()) {
      this.loadVendorFuels();
    }
  }
  resetOneByOneFilters(): void {
    if (this.filters.Vendorname !== "") {
      this.filters.Vendorname = "";
      this.applyFilters();
    } else if (this.filters.DVendorCode !== "") {
      this.filters.DVendorCode = "";
      this.applyFilters();
    } else if (this.filters.PetrolPumpName !== "") {
      this.filters.PetrolPumpName = "";
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
      PetrolPumpName: "",
      Vendorname: "",
      DVendorCode: "",
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
    this.loadVendorFuels();
  }

  // resetCreatedDates() {
  //   this.filters.created_from = null;
  //   this.filters.created_to = null;
  //   this.applyFilters();

  // }

  // resetUpdatedDates() {
  //   this.filters.updated_from = null;
  //   this.filters.updated_to = null;
  //   this.applyFilters();
  // }

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
    this.router.navigate(["/md/vendorfuel/create"]);
  }

  viewRecord() {
    if (this.selectedVendorFuelId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true;
    this.vendorfuelStateService.setVendorFuelListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedVendorFuelId: this.selectedVendorFuelId,
      navigatedFromListView: this.navigatedFromListView,
    });

    this.router.navigate([`/md/vendorfuel/view/${this.selectedVendorFuelId}`]);
  }

  editRecord() {
    if (this.selectedVendorFuelId === null) {
      this.showError("Please select a vendorfuel to edit.");
      return;
    }

    this.router.navigate([`/md/vendorfuel/edit/${this.selectedVendorFuelId}`]);
  }

  deactivateRecord() {
    if (this.selectedVendorFuelId === null) {
      this.showError("Please select a vendorfuel to deactivate.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this vendorfuel?",
      accept: () => {
        if (typeof this.selectedVendorFuelId === "number") {
          this.vendorfuelService
            .deactivateVendorFuel(this.selectedVendorFuelId)
            .subscribe(
              () => {
                this.showSuccess(
                  `VendorFuel with ID ${this.selectedVendorFuelId} deactivated successfully`
                );
                this.loadVendorFuels();
              },
              (error: any) => this.showError("Error deactivating vendorfuel")
            );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedVendorFuelId === null) {
      this.showError("Please select a vendorfuel to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this vendorfuel?",
      accept: () => {
        if (typeof this.selectedVendorFuelId === "number") {
          this.vendorfuelService
            .deleteVendorFuel(this.selectedVendorFuelId)
            .subscribe(
              () => {
                this.showSuccess(
                  `VendorFuel with ID ${this.selectedVendorFuelId} deleted successfully`
                );
                this.loadVendorFuels();
              },
              (error: any) => this.showError("Error deleting vendorfuel")
            );
        }
      },
    });
  }

  onRowSelect(event: any) {
    this.selectedVendorFuelId = event.data.id;
  }

  onRowUnselect(event: any) {
    this.selectedVendorFuelId = null;
  }
}
