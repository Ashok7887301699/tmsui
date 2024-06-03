import { Component, Input, OnInit } from "@angular/core";
import { Driver } from "./models/driver.model";

@Component({
  selector: "app-driver-detail",
  templateUrl: "./driver-detail.component.html",
})
export class DriverDetailComponent implements OnInit {
  @Input() driver: Driver | null = null;

  ngOnInit(): void {
    console.log(this.driver);
  }
}