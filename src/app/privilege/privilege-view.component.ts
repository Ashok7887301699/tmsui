import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PrivilegeService } from "./services/privilege.service";
import { Privilege } from "./models/privilege.model";

@Component({
  selector: 'app-privilege-view',
  templateUrl: "./privilege-view.component.html",

  
})
export class PrivilegeViewComponent implements OnInit {
  privilege: Privilege = {} as Privilege;
  loading: boolean = true;

  constructor(
    private privilegeService: PrivilegeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchPrivilege(id);
    });
  }

  private fetchPrivilege(id: number): void {
    this.privilegeService.getPrivilegeById(id).subscribe(
      (privilege) => {
        this.privilege = privilege;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching privilege:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/um/privilege"]); // Update this path as needed
  }
}
