import { Component, Input } from '@angular/core';
import { Hamali } from "./models/hamali.model";

@Component({
  selector: 'app-hamali-detail',
  templateUrl: './hamali-detail.component.html',
  
})
export class HamaliDetailComponent {
  @Input() hamali: Hamali | null = null; 
}
