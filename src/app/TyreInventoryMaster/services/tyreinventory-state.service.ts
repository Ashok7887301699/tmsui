import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
interface TyreinventoryListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedTyreId?: number | null;
  navigatedFromListView: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class TyreinventoryStateService {

  private tyreinventoryListState = new BehaviorSubject<TyreinventoryListState | null>(null);

  constructor() { }

  settyreinventoryListState(state: TyreinventoryListState) {
    const newState = { ...state };
    this.tyreinventoryListState.next(newState);
  }

  // Method to get the current value as a snapshot
  gettyreinventoryListStateSnapshot() {
    return this.tyreinventoryListState.value;
  }

  // Method to get an observable for state changes
  gettyreinventoryListState() {
    return this.tyreinventoryListState.asObservable();
  }
}
