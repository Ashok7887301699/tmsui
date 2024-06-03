
import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { BranchType } from "./models/branchtype.model";
import { BranchtypeService } from "./services/branchtype.service";
import { BranchtypeStateService } from "./services/branchtype-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: 'app-branchtype-list',
  templateUrl: "./branchtype-list.component.html",

  
})
export class BranchtypeListComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  branchtypes: BranchType[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedBranchTypeId: number | null = null;

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
    { label: "Branch Type", value: "branch_type" },
    { label: "Discription", value: "description" },
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
    private branchtypeService: BranchtypeService,
    private messageService: MessageService,
    private branchtypeStateService: BranchtypeStateService,
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
      { label: "Branch Type", routerLink: "/md/branchtype" },
      { label: "List" },
    ];
    console.log("BranchtypeListComponent: ngOnInit");
    // Load Role on init and restore state if available
    this.restoreStateAndLoadBranchtypes();
  }

  ngOnChanges() {
    console.log("BranchtypeListComponent: ngOnChanges");
  }

  ngOnDestroy() {
    console.log("BranchtypeListComponent: ngOnDestroy");
    // Unsubscribe from subscriptions if any
  }

  restoreStateAndLoadBranchtypes() {
    this.branchtypeStateService.getBranchtypeListState().subscribe((state) => {
      console.log("Role List State updated:", state);
      if (state) {
        this.filters = state.filters;
        this.currentPage = state.currentPage;
        this.perPage = state.perPage;
        this.selectedBranchTypeId = state.selectedBranchTypeId;
        this.navigatedFromListView = state.navigatedFromListView;
      }
    });
    this.loadBranchtypes();
  }

  loadBranchtypes(event?: any) {
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

    this.branchtypeService
      .getBranchtypes(page, perPage, this.prepareFiltersForAPI())
      .subscribe(
        (response: BranchType[] | any) => {
          if (Array.isArray(response)) {
            this.branchtypes = response;
            this.totalRecords = response.length;
          } else {
            this.branchtypes = response.data;
            this.totalRecords = response.total;
          }
          this.loading = false;
        },
        (error: any) => {
          console.error("Error fetching Branchtypes:", error);
          this.loading = false;
        }
      );
  }

  applyFilters() {
    console.log("Loading Branchtype after applying filters.");
    if (this.validateDates()) {
      this.loadBranchtypes();
    }
  }
  resetOneByOneFilters(): void {
    if (this.filters.branch_type !== "") {
      this.filters.branch_type = "";
      this.applyFilters();
    } else if (this.filters.status !== null) {
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
      branch_type: "",
      description: "",
      status: null,
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
    this.loadBranchtypes();
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
    this.router.navigate(["/md/branchtype/create"]);
  }

  viewRecord() {
    if (this.selectedBranchTypeId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true;
    this.branchtypeStateService.setBranchtypeListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedBranchTypeId: this.selectedBranchTypeId,
      navigatedFromListView: this.navigatedFromListView,
    });

    this.router.navigate([`/md/branchtype/view/${this.selectedBranchTypeId}`]);
  }

  editRecord() {
    if (this.selectedBranchTypeId === null) {
      this.showError("Please select a Branchtype to edit.");
      return;
    }

    this.router.navigate([`/md/branchtype/edit/${this.selectedBranchTypeId}`]);
  }

  deactivateRecord() {
    if (this.selectedBranchTypeId === null) {
      this.showError("Please select a Branchtype to deactivate.");
      return;
    }

    console.log(this.selectedBranchTypeId);

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this Branchtype?",
      accept: () => {
        if (typeof this.selectedBranchTypeId === "number") {
          this.branchtypeService.deactivateBranchtype(this.selectedBranchTypeId).subscribe(
            () => {
              this.showSuccess(
                `Branchtype with ID ${this.selectedBranchTypeId} deactivated successfully`
              );
              this.loadBranchtypes();
            },
            (error: any) => this.showError("Error deactivating Branchtype")
          );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedBranchTypeId === null) {
      this.showError("Please select a Branchtype to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this  Branchtype?",
      accept: () => {
        if (typeof this.selectedBranchTypeId === "number") {
          this.branchtypeService.deleteBranchtype(this.selectedBranchTypeId).subscribe(
            () => {
              this.showSuccess(
                ` Role with ID ${this.selectedBranchTypeId} deleted successfully`
              );
              this.loadBranchtypes();
            },
            (error: any) => this.showError("Error deleting  Branchtype")
          );
        }
      },
    });
  }

  onRowSelect(event: any) {
    this.selectedBranchTypeId = event.data.id;
  }

  onRowUnselect(event: any) {
    this.selectedBranchTypeId = null;
  }
}
