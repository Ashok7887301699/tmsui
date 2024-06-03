import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { Role } from "./models/role.model";
import { RoleService } from "./services/role.service";
import { RoleStateService } from "./services/role-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-role-list",
  templateUrl: "./role-list.component.html",
})
export class RoleListComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  roles: Role[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedRoleId: number | null = null;

  rowsPerPageOptions = [10, 20, 50, 100];
  perPage: number = this.rowsPerPageOptions[0];

  navigatedFromListView: boolean = false;

  // Dropdown options
  statusOptions = [
    // { label: "NONE", value: "NONE" },
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "DEACTIVATED", value: "DEACTIVATED" },
    { label: "BLOCKED", value: "BLOCKED" },
  ];

  sortByOptions = [
    // { label: "NONE", value: "NONE" },
    { label: "Role Name", value: "name" },
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
    private roleService: RoleService,
    private messageService: MessageService,
    private roleStateService: RoleStateService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.breadcrumbItems = [
      {
        icon: "pi pi-fw pi-user",
        label: "User Management",
        routerLink: "/home",
      },
      { label: "Role", routerLink: "/um/role" },
      { label: "List" },
    ];
    console.log("RoleListComponent: ngOnInit");
    // Load Role on init and restore state if available
    this.restoreStateAndLoadRoles();
  }

  ngOnChanges() {
    console.log("RoleListComponent: ngOnChanges");
  }

  ngOnDestroy() {
    console.log("RoleListComponent: ngOnDestroy");
    // Unsubscribe from subscriptions if any
  }

  restoreStateAndLoadRoles() {
    this.roleStateService.getRoleListState().subscribe((state) => {
      console.log("Role List State updated:", state);
      if (state) {
        this.filters = state.filters;
        this.currentPage = state.currentPage;
        this.perPage = state.perPage;
        this.selectedRoleId = state.selectedRoleId;
        this.navigatedFromListView = state.navigatedFromListView;
      }
    });
    this.loadRoles();
  }

  loadRoles(event?: any) {
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

    this.roleService
      .getRoles(page, perPage, this.prepareFiltersForAPI())
      .subscribe(
        (response: Role[] | any) => {
          if (Array.isArray(response)) {
            this.roles = response;
            this.totalRecords = response.length;
          } else {
            this.roles = response.data;
            this.totalRecords = response.total;
          }
          this.loading = false;
        },
        (error: any) => {
          console.error("Error fetching Roles:", error);
          this.loading = false;
        }
      );
  }

  applyFilters() {
    console.log("Loading Role after applying filters.");
    if (this.validateDates()) {
      this.loadRoles();
    }
  }
  resetOneByOneFilters(): void {
    if (this.filters.name !== "") {
      this.filters.name = "";
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
      name: "",
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
    this.loadRoles();
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
    this.router.navigate(["/um/role/create"]);
  }

  viewRecord() {
    if (this.selectedRoleId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true;
    this.roleStateService.setRoleListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedRoleId: this.selectedRoleId,
      navigatedFromListView: this.navigatedFromListView,
    });

    this.router.navigate([`/um/role/view/${this.selectedRoleId}`]);
  }

  editRecord() {
    if (this.selectedRoleId === null) {
      this.showError("Please select a role to edit.");
      return;
    }

    this.router.navigate([`/um/role/edit/${this.selectedRoleId}`]);
  }

  deactivateRecord() {
    if (this.selectedRoleId === null) {
      this.showError("Please select a Role to deactivate.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this Role?",
      accept: () => {
        if (typeof this.selectedRoleId === "number") {
          this.roleService.deactivateRole(this.selectedRoleId).subscribe(
            () => {
              this.showSuccess(
                `Role with ID ${this.selectedRoleId} deactivated successfully`
              );
              this.loadRoles();
            },
            (error: any) => this.showError("Error deactivating Role")
          );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedRoleId === null) {
      this.showError("Please select a Role to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this  Role?",
      accept: () => {
        if (typeof this.selectedRoleId === "number") {
          this.roleService.deleteRole(this.selectedRoleId).subscribe(
            () => {
              this.showSuccess(
                ` Role with ID ${this.selectedRoleId} deleted successfully`
              );
              this.loadRoles();
            },
            (error: any) => this.showError("Error deleting  Role")
          );
        }
      },
    });
  }

  onRowSelect(event: any) {
    this.selectedRoleId = event.data.id;
  }

  onRowUnselect(event: any) {
    this.selectedRoleId = null;
  }
}
