import { Component,Input, OnInit } from '@angular/core';
import { Role } from './models/role.model';

@Component({
  selector: 'app-role-detail',
  templateUrl: "./role-detail.component.html",
})
export class RoleDetailComponent implements OnInit {
  @Input() role: Role | null = null;

  ngOnInit(): void {}
  
}
