import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BranchService } from "./services/branch.service";
import { Branch } from "./models/branch.model";

@Component({
  selector: "app-branch-view",
  templateUrl: "./branch-view.component.html",
})
export class BranchViewComponent implements OnInit {
  branch: Branch = {} as Branch;
  loading: boolean = true;

  constructor(
    private branchService: BranchService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // ngOnInit(): void {
  //   this.route.params.subscribe((params) => {
  //     const branchCode = params["branchCode"];
  //     this.fetchBranch(branchCode);
  //   });
  // }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const branchCode = params["branchCode"]; 
      if (branchCode) {
        this.fetchBranch(branchCode);
      }
    });
  }

  private fetchBranch(branchCode: string): void {
    this.branchService.getBranchByCode(branchCode).subscribe(
      (branch) => {
        this.branch = branch;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching branch:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/md/branch"]);
  }
}
