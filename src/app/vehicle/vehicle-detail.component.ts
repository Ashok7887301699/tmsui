import { Component , Input, OnInit } from "@angular/core";
import { Vehicle } from "./models/vehicle.model";

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: "./vehicle-detail.component.html",
  styles: [`
   .customer-details {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
      background-color: #ffffff;
      padding: 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .header h2 {
      color: #333333;
      font-size: 24px;
      margin: 0;
    }

    .content {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      grid-gap: 20px;
      margin-top:40px;
    }

    .detail-item {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 10px;
    }

    .label {
      font-weight: bold;
      color: #666666;
      margin-bottom: 5px;
    }

    .value {
      color: #333333;
      margin-left: 10px;
    }
  `]
})
export class VehicleDetailComponent implements OnInit {
  @Input() vehicle: Vehicle | null = null;

  ngOnInit(): void {
    console.log('edit save', this.vehicle);
      }

}
