import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

interface LrListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedLrId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LrStateService {

  private lrListState = new BehaviorSubject<LrListState | null>(null);

  // Update the state immutably
  setLrListState(state: LrListState) {
    const newState = { ...state };
    this.lrListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getLrListStateSnapshot() {
    return this.lrListState.value;
  }

  // Method to get an observable for state changes
  getLrListState() {
    return this.lrListState.asObservable();
  }
}
