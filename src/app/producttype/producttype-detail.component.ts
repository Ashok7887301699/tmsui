import { Component, Input, OnInit } from '@angular/core';
import { ProductType } from "./models/producttype.model";

@Component({
  selector: 'app-producttype-detail',
  templateUrl: "./producttype-detail.component.html",
  styles: ``
})
export class ProducttypeDetailComponent implements OnInit {
  @Input() producttype: ProductType | null = null;

  ngOnInit(): void {
    // Additional initialization if needed
  }

}
