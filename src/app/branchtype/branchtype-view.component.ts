import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BranchtypeService } from "./services/branchtype.service";
import { BranchType } from "./models/branchtype.model";


@Component({
  selector: 'app-branchtype-view',
  templateUrl: "./branchtype-view.component.html",
 
})
export class BranchtypeViewComponent implements OnInit {
  branchtype: BranchType = {} as BranchType;
  loading: boolean = true;

  constructor(
    private branchtypeService: BranchtypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchBranchtype(id);
    });
  }

  private fetchBranchtype(id: number): void {
    this.branchtypeService.getBranchtypeById(id).subscribe(
      (branchtype) => {
        this.branchtype = branchtype;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching branchtype:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/md/branchtype"]); // Update this path as needed
  }
}
