import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PackagetypeService } from "./services/packagetype.service";
import { PackageType } from "./models/packagetype.model";

@Component({
  selector: 'app-packagetype-view',
  templateUrl: "./packagetype-view.component.html",
})
export class PackagetypeViewComponent implements OnInit {
  packagetype: PackageType = {} as PackageType;
  loading: boolean = true;

  constructor(
    private packagetypeService: PackagetypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchPackageType(id);
    });
  }

  private fetchPackageType(id: number): void {
    this.packagetypeService.getPackageTypeById(id).subscribe(
      (packagetype) => {
        this.packagetype = packagetype;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching package type:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/md/packagetype"]); // Update this path as needed
  }
}
