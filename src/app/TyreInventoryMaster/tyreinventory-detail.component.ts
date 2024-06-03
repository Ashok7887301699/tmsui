import { Tyreinventory } from './models/tyreinventory.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tyreinventory-detail',
 templateUrl:'./tyreinventory-detail.component.html',
  styles: ``
})
export class TyreinventoryDetailComponent {
  @Input() tyreinventory: Tyreinventory | null = null;

  ngOnInit(): void {
console.log(this.tyreinventory);
  }
}
