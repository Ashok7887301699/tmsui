import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api"; // Import MenuItem
import { BreadcrumbService } from "../core/config/breadcrumb.service"; // Update the path as needed


@Component({
  selector: 'app-user',
  templateUrl: "./user.component.html",
})
export class UserComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
