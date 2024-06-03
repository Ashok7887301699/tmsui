import { Component, OnInit, OnDestroy } from "@angular/core";
import { MessageService } from "primeng/api";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { ContractService } from "./services/contract.service";
import { ContractStateService } from "./services/contract-state.service";

@Component({
  selector: "app-contract-list",
  templateUrl: "./contract-list.component.html",
})
export class ContractListComponent implements OnInit, OnDestroy {
  breadcrumbItems: MenuItem[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  filters: any = {};
  loading: boolean = false;
  selectedContractId: number | null = null;
  contracts: any[] = [];
  status: number | null = null;
  rowsPerPageOptions = [10, 20, 50, 100];
  perPage: number = this.rowsPerPageOptions[0];

  navigatedFromListView: boolean = false;

  statusOptions = [
    // { label: "NONE", value: null },
    // { label: "REGISTERED", value: "REGISTERED" },
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "INACTIVE", value: "INACTIVE" },
  ];

  sortByOptions = [
    // { label: "NONE", value: null },
    { label: "Contract id", value: "contract_id" },
    { label: "Customer Name", value: "CustName" },
    { label: "Status", value: "status" },
    { label: "Created At", value: "created_at" },
    { label: "Updated At", value: "updated_at" },
  ];

  sortOrderOptions = [
    // { label: "NONE", value: null },
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private contractService: ContractService, // Corrected service name
    private contractStateService:ContractStateService
  ) {}

  ngOnInit() {
    this.breadcrumbItems = [
      {
        icon: "pi pi-fw pi-database",
        label: "Master Data",
        routerLink: ["/home"],
      },
      { label: "Contract", routerLink: ["/md/Contract"] },
      { label: "List" },
    ];
    this.loadContracts(); // Load contracts initially
  }

  ngOnDestroy() {
    // Clean up any subscriptions here
  }
  loadContracts(event?: any) {
    this.loading = true;
    let page = event ? event.first / event.rows + 1 : 1;
    let perPage = event ? event.rows : 10;
    console
  
    this.contractService
      .getContracts(page, perPage, this.filters)
      .subscribe(
        (response) => {
          this.contracts = response.data;
          this.totalRecords = response.total;
          this.loading = false;
        },
        (error) => {
          console.error("Error fetching contracts:", error);
          this.loading = false;
        }
      );
  }
  resetOneByOneFilters(): void {
    if (this.filters.contract_id !== "") {
      this.filters.contract_id = "";
      this.applyFilters();
    } else if (this.filters.CustName !== "") {
      this.filters.CustName = "";
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
      contract_id: "",
      CustName: "",
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
  
  applyFilters() {
    // Validate and then load tenants
    console.log("Loading tenants after applying filters.");
    if (this.validateDates()) {
      this.loadContracts();
    }
  }

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
    this.loadContracts();
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
  restoreStateAndLoadContracts() {
    this.contractStateService.getContractListState().subscribe((state) => {
      console.log("Contract List State updated:", state);
      if (state) {
        this.filters = state.filters;
        this.currentPage = state.currentPage;
        this.perPage = state.perPage;
        this.selectedContractId = state.selectedContractId;
        this.navigatedFromListView = state.navigatedFromListView;
      }
    });
    this.loadContracts(); // Load contracts with restored state
  }

  createNewRecord() {
    // Navigate to the 'create' route
    this.router.navigate(["/md/contract/create"]);
  }
  viewRecord() {
    if (this.selectedContractId === null) {
      this.showError("Please select a record to view.");
      return;
    }
    this.navigatedFromListView = true;
    this.router.navigate([`/md/contract/view/${this.selectedContractId}`]);
  }

  editRecord() {
    if (this.selectedContractId === null) {
      this.showError("Please select a contract to edit.");
      return;
    }
    this.router.navigate([`/md/contract/edit/${this.selectedContractId}`]);
  }

  deactivateRecord() {
    if (this.selectedContractId === null) {
      this.showError("Please select a contract ID to deactivate.");
      return;
    }
    if (this.status && this.status.toString() === "INACTIVE") {
      this.showError("This contract is already inactive.");
      return;
  }

    this.confirmationService.confirm({
      message: "Are you sure you want to deactivate this contract?",
      accept: () => {
        this.contractService.deactivateTenant(this.selectedContractId).subscribe(
          () => {
            this.showSuccess(`Contract with ID ${this.selectedContractId} deactivated successfully`);
            this.loadContracts();
          },
          (error) => {
            this.showError("Error deactivating contract.");
            console.error("Error deactivating contract:", error);
          }
        );
      },
    });
  }
  

  deleteRecord() {
    if (this.selectedContractId === null) {
      this.showError("Please select a contract to delete.");
      return;
    }
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this contract?",
      accept: () => {
        // Implement deletion logic here
      },
    });
  }

  onRowSelect(event: any) {
    this.selectedContractId = event.data.contract_id;
    this.status = event.data.status;
    console.log(this.selectedContractId);
  }

  onRowUnselect(event: any) {
    this.selectedContractId = null;
  }
}
