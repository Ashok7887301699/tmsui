// content-footer.component.ts
import { Component } from "@angular/core";

@Component({
  selector: "app-content-footer",
  templateUrl: "./content-footer.component.html",
  //styleUrls: ["./content-footer.component.scss"],
})
export class ContentFooterComponent {
  currentYear: number = new Date().getFullYear(); // Retrieve the current year

  constructor() {}
}
