import { Component, Input } from '@angular/core';
import { Vendor } from "./models/vendor.model";

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  
})
export class VendorDetailComponent {
  @Input() vendor: Vendor | null = null; 
}
