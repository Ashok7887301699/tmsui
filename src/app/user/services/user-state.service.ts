import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface UserListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedUserId: number | null;
  navigatedFromListView: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  private userListState = new BehaviorSubject<UserListState | null>(null);

  // Update the state immutably
  setUserListState(state: UserListState) {
    const newState = { ...state };
    this.userListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getUserListStateSnapshot() {
    return this.userListState.value;
  }

  // Method to get an observable for state changes
  getUserListState() {
    return this.userListState.asObservable();
  }
}
