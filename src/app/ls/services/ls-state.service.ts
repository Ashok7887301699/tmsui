import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";


interface lsListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedlsId: number | null;
  navigatedFromListView: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class LsStateService {

  private lsListState = new BehaviorSubject<lsListState | null>(null);


  // Update the state immutably
  setlsListState(state: lsListState) {
    const newState = { ...state };
    this.lsListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getlsListStateSnapshot() {
    return this.lsListState.value;
  }

  // Method to get an observable for state changes
  getlsListState() {
    return this.lsListState.asObservable();
  }
}
