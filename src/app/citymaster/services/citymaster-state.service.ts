import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// Define a TypeScript interface for the state
interface CityMasterListState {
  filters: any;
  currentPage: number;
  perPage: number;
  selectedCityMasterId: number | null;
  navigatedFromListView: boolean | null;
}

@Injectable({
  providedIn: "root",
})
export class CityMasterStateService {
  private cityMasterListState = new BehaviorSubject<CityMasterListState | null>(null);

  // Update the state immutably
  setCityMasterListState(state: CityMasterListState) {
    const newState = { ...state };
    this.cityMasterListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getCityMasterListStateSnapshot() {
    return this.cityMasterListState.value;
  }

  // Method to get an observable for state changes
  getCityMasterListState() {
    return this.cityMasterListState.asObservable();
  }
}
