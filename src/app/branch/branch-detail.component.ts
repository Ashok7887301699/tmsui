import { Component, Input, OnInit } from "@angular/core";
import { Branch } from "./models/branch.model";

@Component({
  selector: "app-branch-detail",
  templateUrl: "./branch-detail.component.html",
})
export class BranchDetailComponent implements OnInit {
  @Input() branch: Branch | null = null;

  ngOnInit(): void {}
}
