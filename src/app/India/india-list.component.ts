import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { India } from "./models/india.model";
import { IndiaService } from "./services/india.service";
import { IndiaStateService } from "./services/india-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-india-list",
  templateUrl: "./india-list.component.html",
})
export class IndiaListComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  indias: India[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedIndiaId: number | null = null; // Changed from selectedIndia to selectedIndiaId
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
    { label: "Country", value: "conutry" },
    { label: "State", value: "state" },
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
    private indiaService: IndiaService,
    private messageService: MessageService,
    private indiaStateService: IndiaStateService, // Add this
    private confirmationService: ConfirmationService,
    private router: Router // Inject Router
  ) {}

  ngOnInit() {
    this.breadcrumbItems = [
      { icon: "pi pi-fw pi-database", label: "Master Data", url: "/home" },
      { label: "Indias", url: "/md/india" },
      { label: "List" }, // Current page, no URL
    ];
    console.log("IndiaListComponent: ngOnInit");
    // Load indias on init and restore state if available
    this.restoreStateAndLoadIndias();
  }

  ngOnChanges() {
    console.log("IndiaListComponent: ngOnChanges");
  }

  ngOnDestroy() {
    console.log("IndiaListComponent: ngOnDestroy");
    // Unsubscribe from subscriptions if any
  }

  restoreStateAndLoadIndias() {
    this.indiaStateService.getIndiaListState().subscribe((state) => {
      console.log("India List State updated:", state);
      if (state) {
        this.filters = state.filters;
        this.currentPage = state.currentPage;
        this.perPage = state.perPage;
        this.selectedIndiaId = state.selectedIndiaId;
        this.navigatedFromListView = state.navigatedFromListView;
      }
    });
    this.loadIndias(); // Load indias with restored state
  }

  loadIndias(event?: any) {
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

    this.indiaService
      .getIndias(page, perPage, this.prepareFiltersForAPI())
      .subscribe(
        (response) => {
          this.indias = response.data;
          this.totalRecords = response.total;
          this.loading = false;
        },
        (error) => {
          console.error("Error fetching indias:", error);
          this.loading = false;
        }
      );
  }

  applyFilters() {
    // Validate and then load indias
    console.log("Loading indias after applying filters.");
    if (this.validateDates()) {
      this.loadIndias();
    }
  }
  resetOneByOneFilters(): void {
    if (this.filters.Country !== "") {
      this.filters.Country = "";
      this.applyFilters();
    } else if (this.filters.state !== "") {
      this.filters.state = "";
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
      Country: "",
      state: "",
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
    this.loadIndias();
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
    this.router.navigate(["/md/india/create"]);
  }

  viewRecord() {
    if (this.selectedIndiaId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true; // Set the flag before navigating
    // Save the current state before navigating
    this.indiaStateService.setIndiaListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedIndiaId: this.selectedIndiaId,
      navigatedFromListView: this.navigatedFromListView,
    });

    // Navigate to the view page
    this.router.navigate([`/md/india/view/${this.selectedIndiaId}`]);
  }

  editRecord() {
    if (this.selectedIndiaId === null) {
      this.showError("Please select a india to edit.");
      return;
    }

    // Navigate to the 'edit' route with the selected india's ID
    this.router.navigate([`/md/india/edit/${this.selectedIndiaId}`]);
  }

  deactivateRecord() {
    if (this.selectedIndiaId === null) {
      this.showError("Please select a india to deactivate.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this india?",
      accept: () => {
        // Ensure selectedIndiaId is a number before calling the service
        if (typeof this.selectedIndiaId === "number") {
          this.indiaService.deactivateIndia(this.selectedIndiaId).subscribe(
            () => {
              this.showSuccess(
                `India with ID ${this.selectedIndiaId} deactivated successfully`
              );
              this.loadIndias(); // Refresh the list
            },
            (error) => this.showError("Error deactivating india")
          );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedIndiaId === null) {
      this.showError("Please select a india to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this india?",
      accept: () => {
        // Ensure selectedIndiaId is a number before calling the service
        if (typeof this.selectedIndiaId === "number") {
          this.indiaService.deleteIndia(this.selectedIndiaId).subscribe(
            () => {
              this.showSuccess(
                `India with ID ${this.selectedIndiaId} deleted successfully`
              );
              this.loadIndias(); // Refresh the list
            },
            (error) => this.showError("Error deleting india")
          );
        }
      },
    });
  }

  onRowSelect(event: any) {
    // Set the selected india ID when a row is selected
    this.selectedIndiaId = event.data.id;
  }

  onRowUnselect(event: any) {
    // Reset the selected india ID when a row is unselected
    this.selectedIndiaId = null;
  }

  // Additional methods as needed...
}
