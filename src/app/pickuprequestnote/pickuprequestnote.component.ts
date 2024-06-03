import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api"; // Import MenuItem
import { BreadcrumbService } from "../core/config/breadcrumb.service";

@Component({
  selector: 'app-pickuprequestnote',
   templateUrl: "./pickuprequestnote.component.html",
})


export class PickuprequestnoteComponent implements OnInit {
constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {}
}

