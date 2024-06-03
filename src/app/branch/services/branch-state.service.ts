import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface BranchListState {
  filters: any;
  currentPage: number;
  perPage: number;
  selectedBranchCode: string | null;
  navigatedFromListView: boolean;
}

@Injectable({
  providedIn: "root",
})
export class BranchStateService {
  private branchListState = new BehaviorSubject<BranchListState | null>(null);

  setBranchListState(state: BranchListState) {
    const newState = { ...state };
    this.branchListState.next(newState);
  }

  getBranchListStateSnapshot() {
    return this.branchListState.value;
  }

  getBranchListState() {
    return this.branchListState.asObservable();
  }
}