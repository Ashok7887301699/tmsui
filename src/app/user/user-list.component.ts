import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { User } from "./models/user.model";
import { UserService } from "./services/user.service";
import { UserStateService } from "./services/user-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";


@Component({
  selector: 'app-user-list',
  templateUrl: "./user-list.component.html",
})
export class UserListComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  users: User[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedUserId: number | null = null; // Changed from selectedTenant to selectedTenantId
  showClear: boolean = true;
  rowsPerPageOptions = [10, 20, 50, 100];
  perPage: number = this.rowsPerPageOptions[0];

  navigatedFromListView: boolean = false;
  loginId: string = ''; // Assuming loginId is a string
  createdFrom: Date | null = null; // Assuming createdFrom is a Date
  createdTo: Date | null = null; // Assuming createdTo is a Date
  // Dropdown options
  statusOptions = [
    // { label: "NONE", value: 'NONE' }, // Allows deselection by setting the value to null
    // { label: "REGISTERED", value: "REGISTERED" },
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  sortByOptions = [
    // { label: "NONE", value: 'NONE' }, // Allows deselection by setting the value to null
    { label: "Login_id", value: "login_id" },
    { label: "mobile_no", value: "mobile_no" },
    { label: "email_id", value: "email_id" },
    { label: "displayname", value: "displayname" },
    { label: "user_type", value: "user_type" },
    { label: "status", value: "status" },
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
    private userService: UserService,
    private messageService: MessageService,
    private userStateService: UserStateService, // Add this
    private confirmationService: ConfirmationService,
    private router: Router // Inject Router
  ) {}

  ngOnInit() {
    this.breadcrumbItems = [
      { icon: "pi pi-fw pi-user", label: "User Management", url: "/home" },
      { label: "Users", url: "/um/user" },
      { label: "List" }, // Current page, no URL
    ];
    console.log("UserListComponent: ngOnInit");
    // Load tenants on init and restore state if available
    this.restoreStateAndLoadUsers();
  }

  ngOnChanges() {
    console.log("UserListComponent: ngOnChanges");
  }

  ngOnDestroy() {
    console.log("UserListComponent: ngOnDestroy");
    // Unsubscribe from subscriptions if any
  }

  restoreStateAndLoadUsers() {
    this.userStateService.getUserListState().subscribe((state) => {
      console.log("User List State updated:", state);
      if (state) {
        this.filters = state.filters;
        this.currentPage = state.currentPage;
        this.perPage = state.perPage;
        this.selectedUserId = state.selectedUserId;
        this.navigatedFromListView = state.navigatedFromListView;
      }
    });
    this.loadUsers(); // Load tenants with restored state
  }

  loadUsers(event?: any) {
    this.loading = true;

    let page = this.currentPage || 1;
    let perPage = this.perPage || 10;
    let sortBy: string = 'updated_at'; // Declaring sortBy with type string and default value
    let sortOrder: string = 'desc'; // Declaring sortOrder with type string and default value
  

    if (event) {
      page =
        event.first !== undefined && event.rows
          ? event.first / event.rows + 1
          : 1;
      perPage = event.rows || 10;
    }

    this.userService
      .getUsers(page, perPage, this.prepareFiltersForAPI(), sortBy, sortOrder)
      .subscribe(
        (response: User[] | any) => {
          if (Array.isArray(response)) {
            this.users = response;
            this.totalRecords = response.length;
          } else {
            this.users = response.data;
            this.totalRecords = response.total;
          }
          this.loading = false;
        },
        (error: any) => {
          console.error("Error fetching Users:", error);
          this.loading = false;
        }
      );
  }

  applyFilters() {
    // if (this.validateDates()) {
    //   this.currentPage = 1; // Reset to the first page when applying filters
    //   this.loadUsers();
    // }
     // Populate the filters object with values from input fields
  this.filters.login_id = this.loginId;
  this.filters.created_from = this.createdFrom;
  this.filters.created_to = this.createdTo;
  this.loadUsers();
  }

  resetOneByOneFilters(): void {
    if ( this.filters.tenant_id !== ""){
      this.filters.tenant_id = "";
      this.applyFilters();
    }else if (this.loginId !== "") {
      this.loginId = "";
      this.applyFilters();
    } else if (this.filters.role_id !== "") {
      this.filters.role_id = "";
      this.applyFilters();
    } else if (this.filters.email_id !== "") {
      this.filters.email_id = "";
      this.applyFilters();
    }else if (this.filters.displayname !== "") {
      this.filters.displayname = "";
      this.applyFilters();
    }else if (this.filters.user_type !== "") {
      this.filters.user_type = "";
      this.applyFilters();
    }else if (this.filters.status !== null) {
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
      login_id: "",
      mobile_no: "",
      email_id: "",
      displayname: "",
      user_type: "",
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
    this.loadUsers();
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
    this.router.navigate(["/um/user/create"]);
  }

  viewRecord() {
    if (this.selectedUserId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true; // Set the flag before navigating
    // Save the current state before navigating
    this.userStateService.setUserListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedUserId: this.selectedUserId,
      navigatedFromListView: this.navigatedFromListView,
    });

    // Navigate to the view page
    this.router.navigate([`/um/user/view/${this.selectedUserId}`]);
  }

  editRecord() {
    if (this.selectedUserId === null) {
      this.showError("Please select a user to edit.");
      return;
    }

    // Navigate to the 'edit' route with the selected user's ID
    this.router.navigate([`/um/user/edit/${this.selectedUserId}`]);
  }

  deactivateRecord() {
    if (this.selectedUserId === null) {
      this.showError("Please select a user to deactivate.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this user?",
      accept: () => {
        // Ensure selectedUserId is a number before calling the service
        if (typeof this.selectedUserId === "number") {
          this.userService.deactivateUser(this.selectedUserId).subscribe(
            () => {
              this.showSuccess(
                `User with ID ${this.selectedUserId} deactivated successfully`
              );
              this.loadUsers(); // Refresh the list
            },
            (error) => this.showError("Error deactivating user")
          );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedUserId === null) {
      this.showError("Please select a user to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this user?",
      accept: () => {
        // Ensure selectedTenantId is a number before calling the service
        if (typeof this.selectedUserId === "number") {
          this.userService.deleteUser(this.selectedUserId).subscribe(
            () => {
              this.showSuccess(
                `Tenant with ID ${this.selectedUserId} deleted successfully`
              );
              this.loadUsers(); // Refresh the list
            },
            (error) => this.showError("Error deleting user")
          );
        }
      },
    });
  }

  onRowSelect(event: any) {
    // Set the selected user ID when a row is selected
    this.selectedUserId = event.data.id;
  }

  onRowUnselect(event: any) {
    // Reset the selected user ID when a row is unselected
    this.selectedUserId = null;
  }

  // Additional methods as needed...
}
