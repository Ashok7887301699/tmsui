import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IndustrytypeService } from "./services/industrytype.service";
import { IndustryType } from "./models/industrytype.model";


@Component({
  selector: 'app-industrytype-view',
  templateUrl: "./industrytype-view.component.html",
 
})
export class IndustrytypeViewComponent implements OnInit {
  industrytype: IndustryType = {} as IndustryType;
  loading: boolean = true;

  constructor(
    private industrytypeService: IndustrytypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchIndustrytype(id);
    });
  }

  private fetchIndustrytype(id: number): void {
    this.industrytypeService.getIndustrytypeById(id).subscribe(
      (industrytype) => {
        this.industrytype = industrytype;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching industrytype:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/md/industrytype"]); // Update this path as needed
  }
}
