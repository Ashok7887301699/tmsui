import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "./services/user.service";
import { User } from "./models/user.model";


@Component({
  selector: 'app-user-view',
  templateUrl: "./user-view.component.html",
})
export class UserViewComponent implements OnInit {
  user: User = {} as User;
  loading: boolean = true;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchUser(id);
    });
  }

  private fetchUser(id: number): void {
    this.userService.getUserById(id).subscribe(
      (user) => {
        this.user = user;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching user:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/um/user"]);
  }
}
