import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

interface PackageTypeListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedPackageTypeId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PackagetypeStateService {

  private packagetypeListState = new BehaviorSubject<PackageTypeListState | null>(null);

  // Update the state immutably
  setPackageTypeListState(state: PackageTypeListState) {
    const newState = { ...state };
    this.packagetypeListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getPackageTypeListStateSnapshot() {
    return this.packagetypeListState.value;
  }

  // Method to get an observable for state changes
  getPackageTypeListState() {
    return this.packagetypeListState.asObservable();
  }
}
