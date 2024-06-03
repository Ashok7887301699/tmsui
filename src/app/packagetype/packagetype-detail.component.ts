import { Component, Input } from '@angular/core';
import { PackageType } from "./models/packagetype.model";

@Component({
  selector: 'app-packagetype-detail',
  templateUrl: './packagetype-detail.component.html',
  
})
export class PackagetypeDetailComponent {
  @Input() packagetype: PackageType | null = null; 
}
