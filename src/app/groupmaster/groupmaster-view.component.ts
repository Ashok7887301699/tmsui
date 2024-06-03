import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupMasterService } from "./services/groupmaster.service";
import { GroupMaster } from "./models/groupmaster.model";

@Component({
  selector: 'app-groupmaster-view',
  templateUrl: "./groupmaster-view.component.html",
})
export class GroupmasterViewComponent implements OnInit {
  groupmaster: GroupMaster = {} as GroupMaster;
  loading: boolean = true;

  constructor(
    private groupmasterService: GroupMasterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchGroupMaster(id);
    });
  }

  private fetchGroupMaster(id: number): void {
    this.groupmasterService.getGroupMasterById(id).subscribe(
      (groupmaster) => {
        this.groupmaster = groupmaster;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching group master:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/md/groupmaster"]); // Update this path as needed
  }
}
