import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductTypeService } from "./services/producttype.service";
import { ProductType } from "./models/producttype.model";

@Component({
  selector: 'app-producttype-view',
  templateUrl: "./producttype-view.component.html",
})
export class ProducttypeViewComponent implements OnInit {
  producttype: ProductType = {} as ProductType;
  loading: boolean = true;

  constructor(
    private producttypeService: ProductTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchProductType(id);
    });
  }

  private fetchProductType(id: number): void {
    this.producttypeService.getProductTypeById(id).subscribe(
      (producttype) => {
        this.producttype = producttype;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching product type:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/md/producttype"]); // Update this path as needed
  }

}
