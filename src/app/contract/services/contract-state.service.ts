import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// Define a TypeScript interface for the state
interface ContractListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedContractId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: "root",
})
export class ContractStateService {
  createcontractslabrate(contract_id: boolean, ContractData: any) {
  }
  private contractListState = new BehaviorSubject<ContractListState | null>(null);

  // Update the state immutably
  setContractListState(state: ContractListState) {
    const newState = { ...state };
    this.contractListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getContractListStateSnapshot() {
    return this.contractListState.value;
  }

  // Method to get an observable for state changes
  getContractListState() {
    return this.contractListState.asObservable();
  }
}
