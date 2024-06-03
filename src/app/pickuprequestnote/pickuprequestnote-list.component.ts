import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { PickuprequestnoteService } from "./services/pickuprequestnote.service";
import { PickupRequestNote } from "./models/pickuprequestnote.model";
import { PickuprequestnoteStateService } from "./services/pickuprequestnote-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-pickuprequestnote-list",
  templateUrl: "./pickuprequestnote-list.component.html",
})
export class PickuprequestnoteListComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  pickupRequestNotes: PickupRequestNote[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedPRNId: number | null = null;

  rowsPerPageOptions = [10, 20, 50, 100];
  perPage: number = this.rowsPerPageOptions[0];

  navigatedFromListView: boolean = false;

  constructor(
    private pickupRequestNoteService: PickuprequestnoteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private PickuprequestnoteStateService: PickuprequestnoteStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.breadcrumbItems = [
      { icon: "pi pi-fw pi-database", label: "Master Data", url: "/home" },
      { label: "Pickup Requests", url: "/fm/prn" },
      { label: "List" },
    ];
    this.restoreStateAndLoadPickupRequestNotes();
  }

  restoreStateAndLoadPickupRequestNotes() {
    this.PickuprequestnoteStateService.getPickuprequestnoteListState().subscribe(
      (state) => {
        console.log("Tenant List State updated:", state);
        if (state) {
          this.filters = state.filters;
          this.currentPage = state.currentPage;
          this.perPage = state.perPage;
          this.selectedPRNId = state.selectedPRNId;
          this.navigatedFromListView = state.navigatedFromListView;
        }
      }
    );
    this.loadPickupRequestNotes(); // Load tenants with restored state
  }

  loadPickupRequestNotes(event?: any) {
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

    this.pickupRequestNoteService
      .getPRNs(page, perPage, this.prepareFiltersForAPI())
      .subscribe(
        (response) => {
          this.pickupRequestNotes = response.data;
          this.totalRecords = response.total;
          this.loading = false;
        },
        (error) => {
          console.error("Error fetching pickup request notes:", error);
          this.loading = false;
        }
      );
  }

  sortByOptions = [
    // { label: "NONE", value: null }, // Allows deselection by setting the value to null

    { label: "PRN NO", value: "PRNId" },
    { label: "Vehicle No", value: "VehicleNo" },
    { label: "Prn Create Hamali Name", value: "Prncreatehamaliname" },
    { label: "Created At", value: "created_at" },
    { label: "Updated At", value: "updated_at" },
  ];

  sortOrderOptions = [
    // { label: "NONE", value: null }, // Allows deselection by setting the value to null
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];

  prepareFiltersForAPI() {
    const filtersForAPI = { ...this.filters };

    // Date conversion for API
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
    // Similar conversion for updated_from and updated_to
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

  applyFilters() {
    // Validate and then load tenants
    console.log("Loading tenants after applying filters.");
    if (this.validateDates()) {
      this.loadPickupRequestNotes();
    }
  }

  resetOneByOneFilters(): void {
    if (this.filters.PRNId !== "") {
      this.filters.PRNId = "";
      this.applyFilters();
    } else if (this.filters.VehicleNo !== "") {
      this.filters.VehicleNo = "";
      this.applyFilters();
    } else if (this.filters.Prncreatehamaliname !== "") {
      this.filters.Prncreatehamaliname = "";
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
      PRNId: "",
      VehicleNo: "",
      Prncreatehamaliname: "",
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

  resetFilters() {
    this.filters = {};
    this.loadPickupRequestNotes();
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

  // Define missing methods
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

  createNewRecord() {
    this.router.navigate(["/fm/prn/create"]);
  }

  arrivalPRN() {
    this.router.navigate(["/fm/prn/arrivalprn"]);
  }

  viewRecord() {
    console.log("testing click");
    console.log(this.selectedPRNId);
    if (this.selectedPRNId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true; // Set the flag before navigating
    // Save the current state before navigating
    this.PickuprequestnoteStateService.setPickuprequestnoteListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedPRNId: this.selectedPRNId, // Corrected variable name
      navigatedFromListView: this.navigatedFromListView,
    });

    this.router.navigate(["/fm/prn/view", this.selectedPRNId]);
  }

  editRecord() {
    // Implement logic to edit a record
  }

  deactivateRecord() {
    // Implement logic to deactivate a record
  }

  deleteRecord() {
    if (this.selectedPRNId === null) {
      this.showError("Please select a citymaster to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this citymaster?",
      accept: () => {
        if (typeof this.selectedPRNId === "number") {
          this.pickupRequestNoteService.deletePRN(this.selectedPRNId).subscribe(
            () => {
              this.showSuccess("Citymaster deleted successfully.");
              this.loadPickupRequestNotes({ first: 0, rows: 10 });
            },
            (error) => {
              this.showError("Error deleting citymaster.");
              console.error("Delete Citymaster Error", error);
            }
          );
        }
      },
    });
  }

  onRowSelect(event: any) {
    this.selectedPRNId = event.data.id;
    console.log(this.selectedPRNId);
  }

  // Additional properties and methods as needed...
}
