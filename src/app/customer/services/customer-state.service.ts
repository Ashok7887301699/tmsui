import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";


interface CustomerListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedSapCustCode: string | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerStateService {

  private CustomerListState = new BehaviorSubject<CustomerListState | null>(null);
  constructor() { }

  
  // Update the state immutably
  setCustomerListState(state: CustomerListState) {
    const newState = { ...state };
    this.CustomerListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getCustomerListStateSnapshot() {
    return this.CustomerListState.value;
  }

  // Method to get an observable for state changes
  getCustomerListState() {
    return this.CustomerListState.asObservable();
  }
}
