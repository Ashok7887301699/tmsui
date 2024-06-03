import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// Define a TypeScript interface for the state
interface DriverListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedDriverId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: "root",
})
export class DriverStateService {
  private driverListState = new BehaviorSubject<DriverListState | null>(null);

  // Update the state immutably
  setDriverListState(state: DriverListState) {
    const newState = { ...state };
    this.driverListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getDriverListStateSnapshot() {
    return this.driverListState.value;
  }

  // Method to get an observable for state changes
  getDriverListState() {
    return this.driverListState.asObservable();
  }
}
