import { Component, Input } from '@angular/core';
import { VendorFuel } from "./models/vendorfuel.model";

@Component({
  selector: 'app-vendorfuel-detail',
  templateUrl: './vendorfuel-detail.component.html',
  
})
export class VendorfuelDetailComponent {
  @Input() vendorfuel: VendorFuel | null = null; 
}
