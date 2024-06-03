import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-prn-dialog-content",
  template: `
    <div>
      <h3>PRN NO: {{ prnNumber }}</h3>
    </div>
  `,
  styles: [
    `
      div {
        text-align: center;
      }
    `,
  ],
})
export class PrnDialogContentComponent implements OnInit {
  prnNumber: string | undefined; // Initialize as undefined

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.prnNumber = params["prnNumber"];
    });
  }
}
