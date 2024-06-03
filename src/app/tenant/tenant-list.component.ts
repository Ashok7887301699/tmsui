import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { Tenant } from "./models/tenant.model";
import { TenantService } from "./services/tenant.service";
import { TenantStateService } from "./services/tenant-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-tenant-list",
  templateUrl: "./tenant-list.component.html",
})
export class TenantListComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  tenants: Tenant[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedTenantId: number | null = null; // Changed from selectedTenant to selectedTenantId
  showClear: boolean = true;
  rowsPerPageOptions = [10, 20, 50, 100];
  perPage: number = this.rowsPerPageOptions[0];

  navigatedFromListView: boolean = false;

  // Dropdown options
  statusOptions = [
    // { label: "NONE", value: 'NONE' }, // Allows deselection by setting the value to null
    // { label: "REGISTERED", value: "REGISTERED" },
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  sortByOptions = [
    // { label: "NONE", value: 'NONE' }, // Allows deselection by setting the value to null
    { label: "Name", value: "name" },
    { label: "Short Name", value: "short_name" },
    { label: "Status", value: "status" },
    { label: "Created At", value: "created_at" },
    { label: "Updated At", value: "updated_at" },
  ];

  sortOrderOptions = [
    // { label: "NONE", value: 'NONE' }, // Allows deselection by setting the value to null
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];
  value: any;

  constructor(
    private tenantService: TenantService,
    private messageService: MessageService,
    private tenantStateService: TenantStateService, // Add this
    private confirmationService: ConfirmationService,
    private router: Router // Inject Router
  ) {}

  ngOnInit() {
    this.breadcrumbItems = [
      { icon: "pi pi-fw pi-database", label: "Master Data", url: "/home" },
      { label: "Tenants", url: "/md/tenants" },
      { label: "List" }, // Current page, no URL
    ];
    console.log("TenantListComponent: ngOnInit");
    // Load tenants on init and restore state if available
    this.restoreStateAndLoadTenants();
  }

  ngOnChanges() {
    console.log("TenantListComponent: ngOnChanges");
  }

  ngOnDestroy() {
    console.log("TenantListComponent: ngOnDestroy");
    // Unsubscribe from subscriptions if any
  }

  restoreStateAndLoadTenants() {
    this.tenantStateService.getTenantListState().subscribe((state) => {
      console.log("Tenant List State updated:", state);
      if (state) {
        this.filters = state.filters;
        this.currentPage = state.currentPage;
        this.perPage = state.perPage;
        this.selectedTenantId = state.selectedTenantId;
        this.navigatedFromListView = state.navigatedFromListView;
      }
    });
    this.loadTenants(); // Load tenants with restored state
  }

  loadTenants(event?: any) {
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

    this.tenantService
      .getTenants(page, perPage, this.prepareFiltersForAPI())
      .subscribe(
        (response) => {
          this.tenants = response.data;
          this.totalRecords = response.total;
          this.loading = false;
        },
        (error) => {
          console.error("Error fetching tenants:", error);
          this.loading = false;
        }
      );
  }

  applyFilters() {
    // Validate and then load tenants
    console.log("Loading tenants after applying filters.");
    if (this.validateDates()) {
      this.loadTenants();
    }
  }
  resetOneByOneFilters(): void {
    if (this.filters.name !== "") {
      this.filters.name = "";
      this.applyFilters();
    } else if (this.filters.short_name !== "") {
      this.filters.short_name = "";
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
      name: "",
      short_name: "",
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
    this.loadTenants();
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
    this.router.navigate(["/md/tenants/create"]);
  }

  viewRecord() {
    if (this.selectedTenantId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true; // Set the flag before navigating
    // Save the current state before navigating
    this.tenantStateService.setTenantListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedTenantId: this.selectedTenantId,
      navigatedFromListView: this.navigatedFromListView,
    });

    // Navigate to the view page
    this.router.navigate([`/md/tenants/view/${this.selectedTenantId}`]);
  }

  editRecord() {
    if (this.selectedTenantId === null) {
      this.showError("Please select a tenant to edit.");
      return;
    }

    // Navigate to the 'edit' route with the selected tenant's ID
    this.router.navigate([`/md/tenants/edit/${this.selectedTenantId}`]);
  }

  deactivateRecord() {
    if (this.selectedTenantId === null) {
      this.showError("Please select a tenant to deactivate.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this tenant?",
      accept: () => {
        // Ensure selectedTenantId is a number before calling the service
        if (typeof this.selectedTenantId === "number") {
          this.tenantService.deactivateTenant(this.selectedTenantId).subscribe(
            () => {
              this.showSuccess(
                `Tenant with ID ${this.selectedTenantId} deactivated successfully`
              );
              this.loadTenants(); // Refresh the list
            },
            (error) => this.showError("Error deactivating tenant")
          );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedTenantId === null) {
      this.showError("Please select a tenant to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this tenant?",
      accept: () => {
        // Ensure selectedTenantId is a number before calling the service
        if (typeof this.selectedTenantId === "number") {
          this.tenantService.deleteTenant(this.selectedTenantId).subscribe(
            () => {
              this.showSuccess(
                `Tenant with ID ${this.selectedTenantId} deleted successfully`
              );
              this.loadTenants(); // Refresh the list
            },
            (error) => this.showError("Error deleting tenant")
          );
        }
      },
    });
  }

  onRowSelect(event: any) {
    // Set the selected tenant ID when a row is selected
    this.selectedTenantId = event.data.id;
  }

  onRowUnselect(event: any) {
    // Reset the selected tenant ID when a row is unselected
    this.selectedTenantId = null;
  }

  // Additional methods as needed...
}
