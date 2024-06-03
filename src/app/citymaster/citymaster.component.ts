import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api"; // Import MenuItem
import { BreadcrumbService } from "../core/config/breadcrumb.service"; // Update the path as needed

@Component({
  selector: 'app-citymaster',
  templateUrl: "./citymaster.component.html",
})
export class CitymasterComponent implements OnInit {
constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {}
}
