// src/app/india/india-view.component.ts

import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IndiaService } from "./services/india.service";
import { India } from "./models/india.model";

@Component({
  selector: "app-india-view",
  templateUrl: "./india-view.component.html",
})
export class IndiaViewComponent implements OnInit {
    india: India = {} as India;
  loading: boolean = true;

  constructor(
    private indiaService: IndiaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchIndia(id);
    });
  }

  private fetchIndia(id: number): void {
    this.indiaService.getIndiaById(id).subscribe(
      (india) => {
        this.india = india;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching india:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/md/india"]);
  }
}
