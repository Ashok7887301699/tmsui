import { Component, Input, OnInit } from '@angular/core';
import { IndustryType } from './models/industrytype.model';

@Component({
  selector: 'app-industrytype-detail',
  templateUrl: "./industrytype-detail.component.html",
  
  
})
export class IndustrytypeDetailComponent implements OnInit {
  @Input() industrytype: IndustryType | null = null;

  ngOnInit(): void {
    // Additional initialization if needed
  }
}
