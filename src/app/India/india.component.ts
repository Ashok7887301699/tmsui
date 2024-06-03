import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api"; // Import MenuItem
import { BreadcrumbService } from "../core/config/breadcrumb.service"; // Update the path as needed

@Component({
  selector: "app-india",
  templateUrl: "./india.component.html",
})
export class IndiaComponent implements OnInit {
    constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {}
}
