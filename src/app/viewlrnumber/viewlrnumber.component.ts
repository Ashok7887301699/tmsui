import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LrService } from './services/lr.service';
@Component({
  selector: 'app-viewlrnumber',
  templateUrl: "./viewlrnumber.component.html",
  styles: ``
})
export class ViewlrnumberComponent implements OnInit {
  customLrNum: any;

  constructor(private route: ActivatedRoute,private lrService:LrService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        this.customLrNum = params['customLrNum'];
        if (this.customLrNum) {
            this.fetchData();
        }
    });
}

fetchData(): void {
    const lrdataUrl = `${this.lrService.getLrUrl1()}?customLrNum=${this.customLrNum}`;
    const fblrdataUrl = `${this.lrService.getLrUrl2()}?customLrNum=${this.customLrNum}`;
    // Rest of your code remains unchanged
}

 
printContent(): void {
  const lrdataUrl = `${this.lrService.getLrUrl1()}/${this.customLrNum}`;
  const fblrdataUrl = `${this.lrService.getLrUrl2()}/${this.customLrNum}`;
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc3RhcGkvdjEvdXNlcmF1dGgvd2l0aGxvZ2luaWQiLCJpYXQiOjE3MTE1MTU5NjUsImV4cCI6MTcxMTU3MzU2NSwibmJmIjoxNzExNTE1OTY1LCJqdGkiOiJHRUxRMk5nVkZSeXhia3NhIiwic3ViIjoiMSIsInBydiI6IjhhOGZkZGQ0ODY5OGYxOTRkMWUyZGUyMWZkNzMxNWU2YzhmNjE4MzQiLCJ0ZW5hbnRfaWQiOjEsInRlbmFudF9uYW1lIjoiVlRDIDNQTCBTZXJ2aWNlcyBMaW1pdGVkIiwidGVuYW50X3Nob3J0X25hbWUiOiJWVElOTUhQVSIsInRlbmFudF9sb2dvX3VybCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zdG9yYWdlL3Z0Yy1sb2dvLmpwZWciLCJkaXNwbGF5bmFtZSI6IlN1cGVyIEFkbWluIiwicHJvZmlsZV9waWNfdXJsIjoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL3N0b3JhZ2UvdXNlci5qcGciLCJsb2dpbl9pZCI6InNhIiwibW9iaWxlX25vIjoiOTg3NjU0MzIxMCIsImVtYWlsX2lkIjoic2FAc3dhdHByby5jbyIsInVzZXJfdHlwZSI6IlNfT1dORVIiLCJyb2xlX2lkIjoxLCJyb2xlX25hbWUiOiJTVVBFUkFETUlOIiwicHJpdmlsZWdlcyI6WyJTWVNfQUxMIl19.JXXe81WHLlnjZy8P8MmxGVzg2Pymx4UJxFUsHbiWlDI'; // Replace with your token

  // Fetch data from lrdataUrl
  fetch(lrdataUrl, {
      headers: {
          'Authorization': `Bearer ${token}`
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(lrData => {
      // Fetch data from fblrdataUrl
      fetch(fblrdataUrl, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(fblrData => {
          // Open a new window
          const printWindow = window.open('', '_blank', 'height=500,width=800');

          if (!printWindow) {
              console.error('Failed to open print window.');
              return;
          }

          // Construct HTML table for LR data
          let lrTableHTML = '<table border="1" >';
          lrTableHTML += '<tr><th colspan="7" style="font-size: 1.10em"><b>INVOICE DETAILS</b></th></tr><tr><th>LR Number</th><th>CN/LR Date</th><th>Invoice Number</th><th>Invoice Date</th><th>Pkg Type</th><th>Product Type</th><th>Number of Packages</th><th>Total AV Weight</th><th>Actual Weight Per Pkg</th><th>Total Actual Weight</th></tr>';
          for (let item of lrData) {
              lrTableHTML += '<tr>';
              lrTableHTML += `<td>${item.lr_id}</td>`;
              lrTableHTML += `<td>${item.created_at}</td>`;
              lrTableHTML += `<td>${item.invoice_num}</td>`;
              lrTableHTML += `<td>${item.invoice_date}</td>`;
              lrTableHTML += `<td>${item.pkg_type}</td>`;
              lrTableHTML += `<td>${item.product_type}</td>`;
              lrTableHTML += `<td>${item.num_of_pkgs}</td>`;
              lrTableHTML += `<td>${item.total_av_weight}</td>`;
              lrTableHTML += `<td>${item.actual_weight_per_pkg}</td>`;
              lrTableHTML += `<td>${item.total_actual_weight}</td>`;
              lrTableHTML += '</tr>';
          }
          lrTableHTML += '</table>';

          // Construct HTML table for FBLR data
          // Construct HTML table for FBLR data
          let fblrTableHTML = '<table border="1" >';
          fblrTableHTML += '<tr><th colspan="7" style="font-size: 1.10em"><b>LR DETAILS</b></th></tr><tr><th>Consignor Id</th><th>Consignor Name</th><th>Consignor Mobile Number</th><th>Payment type</th><th>consignee name</th><th>consignee mobile</th><th>Destination</th><th>To Place</th><th>Truck load type</th><th>Del speed</th><th>Pickup delivery type</th></tr>';
          for (let item of fblrData) {
            fblrTableHTML += '<tr>';
            fblrTableHTML += `<td>${item.consignor_id }</td>`;
            fblrTableHTML += `<td>${item.consignor_name}</td>`;
            fblrTableHTML += `<td>${item.consignor_mobile}</td>`;
            fblrTableHTML += `<td>${item.payment_type}</td>`;
            fblrTableHTML += `<td>${item.consignee_name}</td>`;
            fblrTableHTML += `<td>${item.consignee_mobile}</td>`;
            fblrTableHTML += `<td>${item.from_place}</td>`;
            fblrTableHTML += `<td>${item.to_place}</td>`;
            fblrTableHTML += `<td>${item.truck_load_type}</td>`;
            fblrTableHTML += `<td>${item.del_speed}</td>`;
            fblrTableHTML += `<td>${item.pickup_del_type}</td>`;
            fblrTableHTML += '</tr>';
          }
          fblrTableHTML += '</table>';


          // Write tables to the new window document
          printWindow.document.write(lrTableHTML);
          printWindow.document.write('<br/><br/>'); // Add some space between tables
          printWindow.document.write(fblrTableHTML);
          printWindow.document.close();
          printWindow.focus();

          // Print the content
          printWindow.print();
      })
      .catch(error => console.error('Error fetching FBLR data:', error));
  })
  .catch(error => console.error('Error fetching LR data:', error));
}
}
