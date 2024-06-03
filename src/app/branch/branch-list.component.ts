import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { Branch } from "./models/branch.model";
import { BranchService } from "./services/branch.service";
import { BranchStateService } from "./services/branch-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserContextService } from "../core/services/user-context.service";
import { UserContext } from "../core/models/user-context.model";
import { ConfigService } from "../core/config/config.service";

@Component({
  selector: "app-branch-list",
  templateUrl: "./branch-list.component.html",
})
export class BranchListComponent implements OnInit {
  // userContext: UserContext | null = null;
  token: string | null = null;
  breadcrumbItems: MenuItem[] = [];
  branches: Branch[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedBranchCode: string | null = null;

  rowsPerPageOptions = [10, 20, 50, 100];
  perPage: number = this.rowsPerPageOptions[0];

  navigatedFromListView: boolean = false;

  // Dropdown options
  statusOptions = [
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  sortByOptions = [
    { label: "Branch Code", value: "BranchCode" },
    { label: "Branch Name", value: "BranchName" },
    { label: "GSTStateCode", value: "GSTStateCode" },
    { label: "BranchType", value: "BranchType" },
    { label: "Latitude", value: "Latitude" },
    { label: "Longitude", value: "Longitude" },
    { label: "Country", value: "Country" },
    { label: "State", value: "State" },
    { label: "District", value: "District" },
    { label: "Taluka", value: "Taluka" },
    { label: "City", value: "City" },
    { label: "Status", value: "Status" },
    { label: "Created By", value: "CreatedBy" },
    { label: "Created At", value: "created_at" },
    { label: "Updated At", value: "updated_at" },
  ];

  sortOrderOptions = [
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];

  branchTypeOptions = [
    { label: "OWNED", value: "OWNED" },
    { label: "CP", value: "CP" },
    { label: "HUB", value: "HUB" },
    { label: "ONLY DELIVERY", value: "ONLY DELIVERY" },
    { label: "ONLY BOOKING", value: "ONLY BOOKING" },
  ];

  constructor(
    private http: HttpClient,
    private branchService: BranchService,
    private messageService: MessageService,
    private branchStateService: BranchStateService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private userContextService: UserContextService,
    private configService: ConfigService,
  ) {}

  ngOnInit() {
    const userContext = this.userContextService.getUserContext();
    console.log(userContext);
    if (userContext) {
      // Access the token from the user context
      this.token = this.userContextService.getToken();
      // console.log(this.token);
    }
    this.breadcrumbItems = [
      { icon: "pi pi-fw pi-database", label: "Master Data", url: "/home" },
      { label: "Branches", url: "/md/branch" },
      { label: "List" },
    ];
    console.log("BranchListComponent: ngOnInit");
    this.restoreStateAndLoadBranches();
  }
 
  branchImageUrl(branchCode: string): string {
    // console.log(`${this.configService.apiUrl+"/branch/branchphoto/"}${branchCode}?token=${this.token}`);
    return `${this.configService.apiUrl+"/branch/branchphoto/"}${branchCode}?token=${this.token}`;
  }

  shopActImageUrl(branchCode: string): string {
    // console.log(`${this.configService.apiUrl+"/branch/shopact/"}${branchCode}?token=${this.token}`);
    return `${this.configService.apiUrl+"/branch/shopact/"}${branchCode}?token=${this.token}`;
  }

  ngOnChanges() {
    console.log("BranchListComponent: ngOnChanges");
  }

  ngOnDestroy() {
    console.log("BranchListComponent: ngOnDestroy");
  }

  restoreStateAndLoadBranches() {
    this.branchStateService.getBranchListState().subscribe((state) => {
      console.log("Branch List State updated:", state);
      if (state) {
        this.filters = state.filters;
        this.currentPage = state.currentPage;
        this.perPage = state.perPage;
        this.selectedBranchCode = state.selectedBranchCode;
        this.navigatedFromListView = state.navigatedFromListView;
      }
    });
    this.loadBranches();
  }

  loadBranches(event?: any) {
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

    this.branchService
      .getBranches(page, perPage, this.prepareFiltersForAPI())
      .subscribe(
        (response) => {
          this.branches = response.data;
          // console.log("Branch details : ",this.branches);
          this.totalRecords = response.total;
          this.loading = false;
        },
        (error) => {
          console.error("Error fetching branches:", error);
          this.loading = false;
        }
      );
  }

  applyFilters() {
    console.log("Loading branches after applying filters.");
    if (this.validateDates()) {
      this.loadBranches();
    }
  }

  resetOneByOneFilters(): void {
    if (this.filters.BranchCode !== "") {
      this.filters.BranchCode = "";
      this.applyFilters();
    } else if (this.filters.BranchName !== "") {
      this.filters.BranchName = "";
      this.applyFilters();
    } else if (this.filters.BranchType !== "") {
      this.filters.BranchType = "";
      this.applyFilters();
    } else if (this.filters.State !== "") {
      this.filters.State = "";
      this.applyFilters();
    } else if (this.filters.District !== "") {
      this.filters.District = "";
      this.applyFilters();
    } else if (this.filters.Taluka !== "") {
      this.filters.Taluka = "";
      this.applyFilters();
    } else if (this.filters.short_name !== "") {
      this.filters.short_name = "";
      this.applyFilters();
    } else if (this.filters.City !== "") {
      this.filters.City = "";
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
      BranchCode: "",
      BranchName: "",
      BranchType: "",
      State: "",
      District: "",
      Taluka: "",
      City: "",
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
    this.loadBranches();
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
    // Navigate to the 'create' route
    this.router.navigate(["/md/branch/create"]);
  }

  viewRecord() {
    if (this.selectedBranchCode === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true;
    this.branchStateService.setBranchListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedBranchCode: this.selectedBranchCode,
      navigatedFromListView: this.navigatedFromListView,
    });

    this.router.navigate([`/md/branch/view/${this.selectedBranchCode}`]);
  }

  editRecord() {
    if (this.selectedBranchCode === null) {
      this.showError("Please select a branch to edit.");
      return;
    }

    this.router.navigate([`/md/branch/edit/${this.selectedBranchCode}`]);
  }

  deactivateRecord() {
    if (this.selectedBranchCode === null) {
      this.showError("Please select a branch to deactivate.");
      return;
    }

    // Check if the selected branch is already deactivated
    const selectedBranch = this.branches.find(
      (branch) => branch.BranchCode === this.selectedBranchCode
    );
    if (selectedBranch && selectedBranch.Status === "DEACTIVATED") {
      this.showError("This branch is already deactivated.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this branch?",
      accept: () => {
        if (typeof this.selectedBranchCode === "string") {
          this.branchService
            .deactivateBranch(this.selectedBranchCode)
            .subscribe(
              () => {
                this.showSuccess(
                  `Branch with code ${this.selectedBranchCode} deactivated successfully`
                );
                this.loadBranches();
              },
              (error) => this.showError("Error deactivating branch")
            );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedBranchCode === null) {
      this.showError("Please select a branch to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this branch?",
      accept: () => {
        if (typeof this.selectedBranchCode === "string") {
          this.branchService.deleteBranch(this.selectedBranchCode).subscribe(
            () => {
              this.showSuccess(
                `Branch with code ${this.selectedBranchCode} deleted successfully`
              );
              this.loadBranches();
            },
            (error) => this.showError("Error deleting branch")
          );
        }
      },
    });
  }

  onRowSelect(event: any) {
    this.selectedBranchCode = event.data.BranchCode;
    // console.log(this.selectedBranchCode);
  }

  onRowUnselect(event: any) {
    this.selectedBranchCode = null;
  }

  fetchBranchPhoto(branchCode: string): Observable<Blob> {
    return this.http.get(
      `http://127.0.0.1:8000/stapi/v1/branch/branchphoto/${branchCode}`,
      { responseType: "blob" }
    );
  }

  fetchShopActImage(branchCode: string): Observable<Blob> {
    return this.http.get(
      `http://127.0.0.1:8000/stapi/v1/branch/shopact/${branchCode}`,
      { responseType: "blob" }
    );
  }

  displayBranchImage(imageUrl: string): string {
    if (imageUrl) {
      this.fetchBranchPhoto(imageUrl).subscribe((blob: Blob) => {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          imageUrl = event.target.result;
        };
        reader.readAsDataURL(blob);
      });
    }
    return imageUrl;
  }

  displayShopActImage(imageUrl: string): string {
    if (imageUrl) {
      this.fetchShopActImage(imageUrl).subscribe((blob: Blob) => {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          imageUrl = event.target.result;
        };
        reader.readAsDataURL(blob);
      });
    }
    return imageUrl;
  }
}
