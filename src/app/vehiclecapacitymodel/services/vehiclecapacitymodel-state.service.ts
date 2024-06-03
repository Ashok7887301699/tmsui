import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

// Define a TypeScript interface for the state
interface VehiclecapacitymodelListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedVehiclecapacitymodelId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VehiclecapacitymodelStateService {
  private vehiclecapacitymodelListState = new BehaviorSubject<VehiclecapacitymodelListState | null>(null);

  // Update the state immutably
  setVehiclecapacitymodelListState(state: VehiclecapacitymodelListState) {
    const newState = { ...state };
    this.vehiclecapacitymodelListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getVehiclecapacitymodelListStateSnapshot() {
    return this.vehiclecapacitymodelListState.value;
  }

  // Method to get an observable for state changes
  getVehiclecapacitymodelListState() {
    return this.vehiclecapacitymodelListState.asObservable();
  }

}
