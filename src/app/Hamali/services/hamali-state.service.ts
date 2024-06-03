import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

interface HamaliListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedHamaliId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HamaliStateService {

  private hamaliListState = new BehaviorSubject<HamaliListState | null>(null);

  // Update the state immutably
  setHamaliListState(state: HamaliListState) {
    const newState = { ...state };
    this.hamaliListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getHamaliListStateSnapshot() {
    return this.hamaliListState.value;
  }

  // Method to get an observable for state changes
  getHamaliListState() {
    return this.hamaliListState.asObservable();
  }
}
