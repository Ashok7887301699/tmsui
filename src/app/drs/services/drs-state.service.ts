import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

interface DrsListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedDrsId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DrsStateService {

  private drsListState = new BehaviorSubject<DrsListState | null>(null);

  // Update the state immutably
  setDrsListState(state: DrsListState) {
    const newState = { ...state };
    this.drsListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getDrsListStateSnapshot() {
    return this.drsListState.value;
  }

  // Method to get an observable for state changes
  getDrsListState() {
    return this.drsListState.asObservable();
  }
}
