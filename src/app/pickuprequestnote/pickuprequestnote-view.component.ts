import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PickuprequestnoteService } from "./services/pickuprequestnote.service";
import { PickupRequestNote } from "./models/pickuprequestnote.model";

@Component({
  selector: "app-pickuprequestnote-view",
  templateUrl: "./pickuprequestnote-view.component.html",
})
export class PickuprequestnoteViewComponent implements OnInit {
  pickupRequestNote: PickupRequestNote = {} as PickupRequestNote;
  loading: boolean = true;

  constructor(
    private pickupRequestNoteService: PickuprequestnoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchPickupRequestNote(id);
    });
  }

  private fetchPickupRequestNote(id: number): void {
    this.pickupRequestNoteService.getPRNById(id).subscribe(
      (pickupRequestNote) => {
        this.pickupRequestNote = pickupRequestNote;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching pickup request note:", error);
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/fm/prn"]); // Navigate back to the pickup request note list view
  }
}
