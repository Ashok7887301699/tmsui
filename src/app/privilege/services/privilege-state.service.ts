import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


interface PrivilegeListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedPrivilegeId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PrivilegeStateService {
  private privilegeListState = new BehaviorSubject<PrivilegeListState | null>(null);

  // Update the state immutably
  setPrivilegeListState(state: PrivilegeListState) {
    const newState = { ...state };
    this.privilegeListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getPrivilegeListStateSnapshot() {
    return this.privilegeListState.value;
  }

  // Method to get an observable for state changes
  getPrivilegeListState() {
    return this.privilegeListState.asObservable();
  }
  
}

