import { Component, Input, OnInit } from '@angular/core';
import { GroupMaster } from './models/groupmaster.model';

@Component({
  selector: 'app-groupmaster-detail',
  templateUrl: "./groupmaster-detail.component.html",
 
})
export class GroupmasterDetailComponent implements OnInit {
  @Input() groupmaster: GroupMaster | null = null;

  ngOnInit(): void {
    // Additional initialization if needed
  }
}
