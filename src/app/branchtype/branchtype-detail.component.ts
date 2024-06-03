import { Component, Input, OnInit } from '@angular/core';
import { BranchType } from './models/branchtype.model';

@Component({
  selector: 'app-branchtype-detail',
  templateUrl: "./branchtype-detail.component.html",
  
  
})
export class BranchtypeDetailComponent implements OnInit {
  @Input() branchtype: BranchType | null = null;

  ngOnInit(): void {
    // Additional initialization if needed
  }
}
