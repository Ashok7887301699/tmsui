import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ConfigService } from "../../core/config/config.service";
import { customer } from './../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient, private configService: ConfigService) { }
 // Fetches customers with pagination
 getCustomers(page: number, perPage: number, filters: any): Observable<any> {
  let params = new HttpParams()
    .set("page", page.toString())
    .set("per_page", perPage.toString());

  // Include other filters if provided
  for (const key in filters) {
    if (filters[key]) {
      params = params.append(key, filters[key]);
    }
  }

  return this.http.get<any>(this.configService.customerUrl, { params });
}


 // Fetches a single customers by id
 getCustomerById(sap_cust_code: string): Observable<customer> {
  return this.http.get<customer>(`${this.configService.customerUrl}/${sap_cust_code}`);
}

// Creates a new customers
// createCustomer(customers: customer): Observable<customer> {
//   return this.http.post<customer>(this.configService.customerUrl, customers);
// }
// Creates multiple customers
// createCustomer(customers: customer[]): Observable<customer[]> {
//   return this.http.post<customer[]>(this.configService.customerUrl, customers);
// }

  // Creates a new city master
  createCustomer(customers: customer[]): Observable<customer> {
    return this.http.post<customer>(
      this.configService.customerUrl,
      { data: customers } // Wrap the array in an object with the key 'data'
    );
  }
  // 

  getindtype(): Observable<any[]> {
    const endpoint = `${this.configService.customerUrl}/name`; // Updated endpoint
 
    return this.http.get<any[]>(endpoint);
    }

    getdepotname(): Observable<any[]> {
      const endpoint = `${this.configService.customerUrl}/fetchdeponame`; // Updated endpoint
   
      return this.http.get<any[]>(endpoint);
      }

      getgroupcode(): Observable<any[]> {
        const endpoint = `${this.configService.customerUrl}/groupcode`; // Updated endpoint
     
        return this.http.get<any[]>(endpoint);
        }

      
    


// Updates an existing customers
updateCustomer(sap_cust_code: string, customers: customer): Observable<customer> {
  return this.http.put<customer>(
    `${this.configService.customerUrl}/${sap_cust_code}`,
    customers
  );
}

// Deactivates a customers
deactivateCustomer(sap_cust_code: string): Observable<any> {
  return this.http.patch(
    `${this.configService.customerUrl}/${sap_cust_code}/deactivate`,
    null
  );
}

// Deletes a customers
deleteCustomer(sap_cust_code: string): Observable<any> {
  return this.http.delete(`${this.configService.customerUrl}/${sap_cust_code}`);
}
private panUrl = 'https://kyc-api.aadhaarkyc.io/api/v1/pan/pan';

getPanDetails(panNumber: string): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1NDAzMjgwMiwianRpIjoiNzYxYjQxMzMtMzA2Ny00MjI1LWFlZjgtY2EyZTk0ODc5ZDI5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnZ0YzNwbEBhYWRoYWFyYXBpLmlvIiwibmJmIjoxNjU0MDMyODAyLCJleHAiOjE5NjkzOTI4MDIsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJyZWFkIl19fQ.r75DIUqA6rr8aNzHxluaFL-67Q8otpVZfV24rllUfk0'
  });

  const body = {
    id_number: panNumber
  };

  return this.http.post<any>(this.panUrl, body, { headers });
}


getExistingCustomerCodes(): Observable<any[]> {
  const endpoint = `${this.configService.customerUrl}/existing_cust_code`; // Updated endpoint

  return this.http.get<any[]>(endpoint);
}

 // Check if PAN exists
 checkPANExists(panNumber: string): Observable<boolean> {
  return this.http.get<boolean>(`${this.configService.customerUrl}/PAN?PAN=${panNumber}`);
}

}

