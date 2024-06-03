import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface RoleListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedRoleId: number | null;
  navigatedFromListView: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class RoleStateService {

  private roleListState = new BehaviorSubject<RoleListState | null>(null);

  // Update the state immutably
  setRoleListState(state: RoleListState) {
    const newState = { ...state };
    this.roleListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getRoleListStateSnapshot() {
    return this.roleListState.value;
  }

  // Method to get an observable for state changes
  getRoleListState() {
    return this.roleListState.asObservable();
  }
}
