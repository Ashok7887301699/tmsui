import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

interface IndustrytypeListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedIndustryTypeId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class IndustrytypeStateService {

  private industrytypeListState = new BehaviorSubject<IndustrytypeListState | null>(null);

  // Update the state immutably
  setIndustrytypeListState(state: IndustrytypeListState) {
    const newState = { ...state };
    this.industrytypeListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getIndustrytypeListStateSnapshot() {
    return this.industrytypeListState.value;
  }

  // Method to get an observable for state changes
  getIndustrytypeListState() {
    return this.industrytypeListState.asObservable();
  }
}
