import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// Define a TypeScript interface for the state
interface ProductTypeListState {
  filters: any; // Define a more specific type if possible
  currentPage: number;
  perPage: number;
  selectedProductTypeId: number | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: "root",
})
export class ProductTypeStateService {
  private producttypeListState = new BehaviorSubject<ProductTypeListState | null>(null);

  // Update the state immutably
  setProductTypeListState(state: ProductTypeListState) {
    const newState = { ...state };
    this.producttypeListState.next(newState);
  }

  // Method to get the current value as a snapshot
  getProductTypeListStateSnapshot() {
    return this.producttypeListState.value;
  }

  // Method to get an observable for state changes
  getProductTypeListState() {
    return this.producttypeListState.asObservable();
  }
}
