import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

interface BranchtypeListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedBranchTypeId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BranchtypeStateService {

  private branchtypeListState = new BehaviorSubject<BranchtypeListState | null>(null);

  // Update the state immutably
  setBranchtypeListState(state: BranchtypeListState) {
    const newState = { ...state };
    this.branchtypeListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getBranchtypeListStateSnapshot() {
    return this.branchtypeListState.value;
  }

  // Method to get an observable for state changes
  getBranchtypeListState() {
    return this.branchtypeListState.asObservable();
  }
}
