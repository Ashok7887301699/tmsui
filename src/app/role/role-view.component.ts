import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RoleService } from "./services/role.service";
import { Role } from "./models/role.model";

@Component({
  selector: 'app-role-view',
  templateUrl: "./role-view.component.html",
})
export class RoleViewComponent implements OnInit {
  role: Role = {} as Role;
  loading: boolean = true;

  constructor(
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchRole(id);
    });
  }

  private fetchRole(id: number): void {
    this.roleService.getRoleById(id).subscribe(
      (role) => {
        this.role = role;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching role:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/um/role"]); // Update this path as needed
  }
}
