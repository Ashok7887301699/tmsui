// src/app/india/india-detail.component.ts

import { Component, Input, OnInit } from "@angular/core";
import { India } from "./models/india.model";

@Component({
  selector: "app-india-detail",
  templateUrl: "./india-detail.component.html",
})
export class IndiaDetailComponent implements OnInit {
  @Input() india: India | null = null;

  ngOnInit(): void {
console.log(this.india);
  }
}
