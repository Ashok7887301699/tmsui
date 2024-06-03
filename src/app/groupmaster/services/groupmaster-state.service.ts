import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

interface GroupMasterListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedGroupMasterId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GroupMasterStateService {

  private groupmasterListState = new BehaviorSubject<GroupMasterListState | null>(null);

  // Update the state immutably
  setGroupMasterListState(state: GroupMasterListState) {
    const newState = { ...state };
    this.groupmasterListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getGroupMasterListStateSnapshot() {
    return this.groupmasterListState.value;
  }

  // Method to get an observable for state changes
  getGroupMasterListState() {
    return this.groupmasterListState.asObservable();
  }
}
