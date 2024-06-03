import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// Define a TypeScript interface for the state
interface TenantListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedTenantId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: "root",
})
export class TenantStateService {
  private tenantListState = new BehaviorSubject<TenantListState | null>(null);

  // Update the state immutably
  setTenantListState(state: TenantListState) {
    const newState = { ...state };
    this.tenantListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getTenantListStateSnapshot() {
    return this.tenantListState.value;
  }

  // Method to get an observable for state changes
  getTenantListState() {
    return this.tenantListState.asObservable();
  }
}
