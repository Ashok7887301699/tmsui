import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

interface VendorListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedVendorId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VendorStateService {

  private vendorListState = new BehaviorSubject<VendorListState | null>(null);

  // Update the state immutably
  setVendorListState(state: VendorListState) {
    const newState = { ...state };
    this.vendorListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getVendorListStateSnapshot() {
    return this.vendorListState.value;
  }

  // Method to get an observable for state changes
  getVendorListState() {
    return this.vendorListState.asObservable();
  }
}
