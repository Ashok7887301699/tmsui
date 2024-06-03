import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { GroupMaster } from "./models/groupmaster.model";
import { GroupMasterService } from "./services/groupmaster.service";
import { GroupMasterStateService } from "./services/groupmaster-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: 'app-groupmaster-list',
  templateUrl: "./groupmaster-list.component.html",
})
export class GroupmasterListComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  groupmasters: GroupMaster[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedGroupMasterId: number | null = null;

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
    { label: "Group Code", value: "groupcode" },
    { label: "Group Name", value: "groupname" },
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
    private groupmasterService: GroupMasterService,
    private messageService: MessageService,
    private groupmasterStateService: GroupMasterStateService,
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
        label: "Group Master",
        routerLink: "/md/groupmaster",
      },
      { label: "List" },
    ];
    console.log("GroupMasterListComponent: ngOnInit");
    // Load GroupMaster on init and restore state if available
    this.restoreStateAndLoadGroupMasters();
  }

  ngOnChanges() {
    console.log("GroupMasterListComponent: ngOnChanges");
  }

  ngOnDestroy() {
    console.log("GroupMasterListComponent: ngOnDestroy");
    // Unsubscribe from subscriptions if any
  }

  restoreStateAndLoadGroupMasters() {
    this.groupmasterStateService
      .getGroupMasterListState()
      .subscribe((state) => {
        console.log("Group Master List State updated:", state);
        if (state) {
          this.filters = state.filters;
          this.currentPage = state.currentPage;
          this.perPage = state.perPage;
          this.selectedGroupMasterId =
            state.selectedGroupMasterId;
          this.navigatedFromListView = state.navigatedFromListView;
        }
      });
    this.loadGroupMasters();
  }

  loadGroupMasters(event?: any) {
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

    this.groupmasterService
      .getGroupMasters(page, perPage, this.prepareFiltersForAPI())
      .subscribe(
        (response: GroupMaster[] | any) => {
          if (Array.isArray(response)) {
            this.groupmasters = response;
            this.totalRecords = response.length;
          } else {
            this.groupmasters = response.data;
            this.totalRecords = response.total;
          }
          this.loading = false;
        },
        (error: any) => {
          console.error("Error fetching groupmasters:", error);
          this.loading = false;
        }
      );
  }

  applyFilters() {
    console.log("Loading Group Master after applying filters.");
    if (this.validateDates()) {
      this.loadGroupMasters();
    }
  }
  resetOneByOneFilters(): void {
    if (this.filters.groupcode !== "") {
      this.filters.groupcode = "";
      this.applyFilters();
    } else if (this.filters.groupname !== "") {
      this.filters.groupname = "";
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
      groupcode: "",
      groupname: "",
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
    this.loadGroupMasters();
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
    this.router.navigate(["/md/groupmaster/create"]);
  }

  viewRecord() {
    if (this.selectedGroupMasterId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true;
    this.groupmasterStateService.setGroupMasterListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedGroupMasterId: this.selectedGroupMasterId,
      navigatedFromListView: this.navigatedFromListView,
    });

    this.router.navigate([
      `/md/groupmaster/view/${this.selectedGroupMasterId}`,
    ]);
  }

  editRecord() {
    if (this.selectedGroupMasterId === null) {
      this.showError("Please select a groupmaster to edit.");
      return;
    }

    this.router.navigate([
      `/md/groupmaster/edit/${this.selectedGroupMasterId}`,
    ]);
  }

  deactivateRecord() {
    if (this.selectedGroupMasterId === null) {
      this.showError("Please select a  Group Master to deactivate.");
      return;
    }

    this.confirmationService.confirm({
      message:
        "Are you sure you want to deactivate this Group Master?",
      accept: () => {
        if (typeof this.selectedGroupMasterId === "number") {
          this.groupmasterService
            .deactivateGroupMaster(this.selectedGroupMasterId)
            .subscribe(
              () => {
                this.showSuccess(
                  `Group Master with ID ${this.selectedGroupMasterId} deactivated successfully`
                );
                this.loadGroupMasters();
              },
              (error: any) =>
                this.showError("Error deactivating  Group Master")
            );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedGroupMasterId === null) {
      this.showError("Please select a  Group Master to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this  Group Master?",
      accept: () => {
        if (typeof this.selectedGroupMasterId === "number") {
          this.groupmasterService
            .deleteGroupMaster(this.selectedGroupMasterId)
            .subscribe(
              () => {
                this.showSuccess(
                  ` Group Master with ID ${this.selectedGroupMasterId} deleted successfully`
                );
                this.loadGroupMasters();
              },
              (error: any) =>
                this.showError("Error deleting  Group Master")
            );
        }
      },
    });
  }

  onRowSelect(event: any) {
    this.selectedGroupMasterId = event.data.id;
  }

  onRowUnselect(event: any) {
    this.selectedGroupMasterId = null;
  }
}
