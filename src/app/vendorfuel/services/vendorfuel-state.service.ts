import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

interface VendorFuelListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedVendorFuelId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VendorfuelStateService {

  private vendorfuelListState = new BehaviorSubject<VendorFuelListState | null>(null);

  // Update the state immutably
  setVendorFuelListState(state: VendorFuelListState) {
    const newState = { ...state };
    this.vendorfuelListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getVendorFuelListStateSnapshot() {
    return this.vendorfuelListState.value;
  }

  // Method to get an observable for state changes
  getVendorFuelListState() {
    return this.vendorfuelListState.asObservable();
  }
}
