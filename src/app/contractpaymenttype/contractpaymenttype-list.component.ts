import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { ContractPaymentType } from "./models/contractpaymenttype.model";
import { ContractPaymentTypeService } from "./services/contractpaymenttype.service";
import { ContractPaymentTypeStateService } from "./services/contractpaymenttype-state.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-contractpaymenttype-list",
  templateUrl: "./contractpaymenttype-list.component.html",
})
export class ContractPaymentTypesListComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  contractpaymenttype: ContractPaymentType[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedContractPaymentTypeId: number | null = null;

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
    // { label: "None", value: "None" },
    { label: "paymenttype", value: "contract_paymenttype" },
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
    private contractpaymenttypeService: ContractPaymentTypeService,
    private messageService: MessageService,
    private contractpaymenttypeStateService: ContractPaymentTypeStateService,
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
      { label: "PaymentType", routerLink: "/md/paymenttype" },
      { label: "List" },
    ];
    this.restoreStateAndLoadContractPaymentTypes();
  }

  restoreStateAndLoadContractPaymentTypes() {
    this.contractpaymenttypeStateService
      .getContractPaymentTypeListState()
      .subscribe((state) => {
        if (state) {
          this.filters = state.filters;
          this.currentPage = state.currentPage;
          this.perPage = state.perPage;
          this.selectedContractPaymentTypeId =
            state.selectedContractPaymentTypeId;
          this.navigatedFromListView = state.navigatedFromListView;
        }
      });
    this.loadContractPaymentTypes();
  }

  loadContractPaymentTypes(event?: any) {
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

    this.contractpaymenttypeService
      .getContractPaymentTypes(page, perPage, this.prepareFiltersForAPI())
      .subscribe(
        (response: any) => {
          this.contractpaymenttype = response.data;
          this.totalRecords = response.total;
          this.loading = false;
        },
        (error: any) => {
          console.error("Error fetching contractpaymenttypes:", error);
          this.loading = false;
        }
      );
  }

  applyFilters() {
    // Validate and then load tenants
    console.log("Loading ContractPaymentTypes after applying filters.");
    if (this.validateDates()) {
      this.loadContractPaymentTypes();
    }
  }
  resetOneByOneFilters(): void {
    if (this.filters.contract_paymenttype !== "") {
      this.filters.contract_paymenttype = "";
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
    this.loadContractPaymentTypes();
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
    this.router.navigate(["/md/paymenttype/create"]);
  }

  viewRecord() {
    if (this.selectedContractPaymentTypeId === null) {
      this.showError("Please select a record to view.");
      return;
    }

    this.navigatedFromListView = true;
    this.contractpaymenttypeStateService.setContractPaymentTypeListState({
      filters: this.filters,
      currentPage: this.currentPage,
      perPage: this.perPage,
      selectedContractPaymentTypeId: this.selectedContractPaymentTypeId,
      navigatedFromListView: this.navigatedFromListView,
    });

    this.router.navigate([
      `/md/paymenttype/view/${this.selectedContractPaymentTypeId}`,
    ]);
  }

  editRecord() {
    if (this.selectedContractPaymentTypeId === null) {
      this.showError("Please select a payment type to edit.");
      return;
    }

    this.router.navigate([
      `/md/paymenttype/edit/${this.selectedContractPaymentTypeId}`,
    ]);
  }

  deactivateRecord() {
    if (this.selectedContractPaymentTypeId === null) {
      this.showError("Please select a payment type to deactivate.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this Payment type?",
      accept: () => {
        if (typeof this.selectedContractPaymentTypeId === "number") {
          this.contractpaymenttypeService
            .deactivateContractPaymentType(this.selectedContractPaymentTypeId)
            .subscribe(
              () => {
                this.showSuccess(
                  `Payment type with ID ${this.selectedContractPaymentTypeId} deactivated successfully`
                );
                this.loadContractPaymentTypes();
              },
              (error: any) => this.showError("Error deactivating Payment type")
            );
        }
      },
    });
  }

  deleteRecord() {
    if (this.selectedContractPaymentTypeId === null) {
      this.showError("Please select a Payment type to delete.");
      return;
    }

    this.confirmationService.confirm({
      message: "Are you sure you want to delete this Payment type?",
      accept: () => {
        if (typeof this.selectedContractPaymentTypeId === "number") {
          this.contractpaymenttypeService
            .deleteContractPaymentType(this.selectedContractPaymentTypeId)
            .subscribe(
              () => {
                this.showSuccess(
                  `Payment type with ID ${this.selectedContractPaymentTypeId} deleted successfully`
                );
                this.loadContractPaymentTypes();
              },
              (error: any) => this.showError("Error deleting Payment type")
            );
        }
      },
    });
  }

  onRowSelect(event: any) {
    this.selectedContractPaymentTypeId = event.data.id;
  }

  onRowUnselect(event: any) {
    this.selectedContractPaymentTypeId = null;
  }
}
