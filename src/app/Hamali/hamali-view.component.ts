import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HamaliService } from "./services/hamali.service";
import { Hamali } from "./models/hamali.model";

@Component({
  selector: 'app-hamali-view',
  templateUrl: "./hamali-view.component.html",
})
export class HamaliViewComponent implements OnInit {
  hamali: Hamali = {} as Hamali;
  loading: boolean = true;

  constructor(
    private hamaliService: HamaliService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchHamali(id);
    });
  }

  private fetchHamali(id: number): void {
    this.hamaliService.getHamaliById(id).subscribe(
      (hamali) => {
        this.hamali = hamali;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching hamali type:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/md/hamali"]); // Update this path as needed
  }
}
