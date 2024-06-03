import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// Define a TypeScript interface for the state
interface PickuprequestnoteListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedPRNId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: "root",
})
export class PickuprequestnoteStateService {
  private pickuprequestnoteListState = new BehaviorSubject<PickuprequestnoteListState | null>(null);

  // Update the state immutably
  setPickuprequestnoteListState(state: PickuprequestnoteListState) {
    const newState = { ...state };
    this.pickuprequestnoteListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getPickuprequestnoteListStateSnapshot() {
    return this.pickuprequestnoteListState.value;
  }

  // Method to get an observable for state changes
  getPickuprequestnoteListState() {
    return this.pickuprequestnoteListState.asObservable();
  }
}
