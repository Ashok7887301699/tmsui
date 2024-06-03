import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";


interface VehicleListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedVehicleId: number | null;
  navigatedFromListView: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class VehicleStateService {

  // constructor() { }

  private VehicleListState = new BehaviorSubject<VehicleListState | null>(null);

  // Update the state immutably
  setVehicleListState(state: VehicleListState) {
    const newState = { ...state };
    this.VehicleListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getVehicleListStateSnapshot() {
    return this.VehicleListState.value;
  }

  // Method to get an observable for state changes
  getVehicleListState() {
    return this.VehicleListState.asObservable();
  }
}
