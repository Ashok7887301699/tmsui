import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

interface ContractPaymentTypeListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedContractPaymentTypeId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ContractPaymentTypeStateService {

  private contractpaymenttypeListState = new BehaviorSubject<ContractPaymentTypeListState | null>(null);

  // Update the state immutably
  setContractPaymentTypeListState(state: ContractPaymentTypeListState) {
    const newState = { ...state };
    this.contractpaymenttypeListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getContractPaymentTypeListStateSnapshot() {
    return this.contractpaymenttypeListState.value;
  }

  // Method to get an observable for state changes
  getContractPaymentTypeListState() {
    return this.contractpaymenttypeListState.asObservable();
  }
}
