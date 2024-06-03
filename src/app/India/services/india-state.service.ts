import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// Define a TypeScript interface for the state
interface IndiaListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedIndiaId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: "root",
})
export class IndiaStateService {
  private indiaListState = new BehaviorSubject<IndiaListState | null>(null);

  // Update the state immutably
  setIndiaListState(state: IndiaListState) {
    const newState = { ...state };
    this.indiaListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getIndiaListStateSnapshot() {
    return this.indiaListState.value;
  }

  // Method to get an observable for state changes
  getIndiaListState() {
    return this.indiaListState.asObservable();
  }
}
