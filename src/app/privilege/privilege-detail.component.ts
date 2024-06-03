import { Component, Input, OnInit } from '@angular/core';
import { Privilege } from './models/privilege.model';

@Component({
  selector: 'app-privilege-detail',
  templateUrl: "./privilege-detail.component.html",
})
export class PrivilegeDetailComponent implements OnInit {
  @Input() privilege: Privilege | null = null;

  ngOnInit(): void {
    // Additional initialization if needed
  }
}
