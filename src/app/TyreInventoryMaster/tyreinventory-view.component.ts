import { TyreinventoryService } from './services/tyreinventory.service';
import { Tyreinventory } from './models/tyreinventory.model';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tyreinventory-view',
  templateUrl:'./tyreinventory-view.component.html',

  styles: ``
})
export class TyreinventoryViewComponent {
  Tyreinventory: Tyreinventory = {} as Tyreinventory;
  loading: boolean = true;

  constructor(
    private TyreinventoryService:TyreinventoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.fetchTyreInventory(id);
    });
  }
  private fetchTyreInventory(id: number): void {
    this.TyreinventoryService.gettyreinventoryById(id).subscribe(
      (Tyreinventory) => {
        this.Tyreinventory = Tyreinventory;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching Tyreinventory:", error);
        this.loading = false;
      }
    );
  }
  goBack(): void {
    this.router.navigate(["/md/tyreinventory"]);
  }
}
