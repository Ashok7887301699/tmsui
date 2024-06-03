import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Lr } from "../models/lr.model";
import { ConfigService } from "../../core/config/config.service";

@Injectable({
  providedIn: 'root'
})
export class LrService {
  getCustomerNameById(selectedCustomerId: string) {
    throw new Error("Method not implemented.");
  }
  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Fetches lr with pagination and filters
  getLrs(page: number, perPage: number, filters: any): Observable<Lr[]> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<Lr[]>(this.configService.lrUrl, { params });
  }

  // Fetches a single Lr by id
  getLrById(id: number): Observable<Lr> {
    return this.http.get<Lr>(`${this.configService.lrUrl}/${id}`);
  }

  // Creates a new Lr
  createLr(lr: Lr): Observable<Lr> {
    return this.http.post<Lr>(this.configService.lrUrl, lr);
  }
  getLrUrl(): string {
    return this.configService.lrUrl;
  }
  // Updates an existing Lr
  updateLr(id: number, lr: Lr): Observable<Lr> {
    return this.http.put<Lr>(
      `${this.configService.lrUrl}/${id}`,
      lr
    );
  }

  // Deactivates a Lr
  deactivateLr(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.lrUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a Lr
  deleteLr(id: number): Observable<any> {
    return this.http.delete(`${this.configService.lrUrl}/${id}`);
  }

  getpaymodel(): Observable<any[]> {
    const endpoint = `${this.configService.lrUrl}/paymodel`; // Updated endpoint
 
    return this.http.get<any[]>(endpoint);
    }
    getpackagingmodel(): Observable<any[]> {
      const endpoint = `${this.configService.lrUrl}/packagetype/getdata`; // Updated endpoint
   
      return this.http.get<any[]>(endpoint);
      }
      getproductmodel(): Observable<any[]> {
        const endpoint = `${this.configService.lrUrl}/producttype/getpro`; // Updated endpoint
     
        return this.http.get<any[]>(endpoint);
        }
        getcontractmodel(): Observable<any[]> {
          const endpoint = `${this.configService.lrUrl}/contracttype/getcontract`; // Updated endpoint
       
          return this.http.get<any[]>(endpoint);
          }
        searchCustomers(query: string, paytype: string): Observable<any[]> {
          return this.http.get<any[]>(`${this.configService.lrUrl}/data/${query}/${paytype}`);
        }


//        searchContracts(Invoicenoofpkg: string, contractId: string) {
//   console.log('myresponse',Invoicenoofpkg);
//   console.log('myresponsenew',contractId);
//   // Make your HTTP request here, replacing the URL with your actual API endpoint
//   return this.http.get<any>('https://stapi/v1/lr/selectContractSlabDefinition/selectContractSlabDefinition/', {
//     params: {
//       Invoicenoofpkg: Invoicenoofpkg,
//       contractId: contractId
//     }
//   });
// }

// searchContractsalbrate(contractId: string,Invoicenoofpkg: string): Observable<any> {
//   console.log('Invoicenoofpkg:', Invoicenoofpkg);
//   console.log('contractId:', contractId);
  
//   let params = new HttpParams()
//     .set('Invoicenoofpkg', Invoicenoofpkg)
//     .set('contractId', contractId);

//   const url = `https://stapi/v1/lr/selectContractSlabDefinition/${contractId}/${Invoicenoofpkg}`;
//   console.log('URL:', url); // Log the constructed URL

//   return this.http.get<any>(url, { params: params });
// }
searchContractsalbrate(contractId: string, Invoicenoofpkg: string): Observable<any[]> {
  // Construct the endpoint URL with parameters directly embedded in the URL
  const endpoint = `${this.configService.lrUrl}/selectContractSlabDefinition/${contractId}/${Invoicenoofpkg}`;

  // Make HTTP GET request with the constructed endpoint URL
  return this.http.get<any[]>(endpoint);
}


// searchContracts1(Invoicenoofpkg: string) {
//   console.log('myresponse',Invoicenoofpkg);
 
//   // Make your HTTP request here, replacing the URL with your actual API endpoint
//   return this.http.get<any>('https://stapi/v1/lr/selectContractSlabDefinition/selectContractSlabDefinition/', {
//     params: {
//       Invoicenoofpkg: Invoicenoofpkg,
    
//     }
//   });
// }
    searchfromCity(query: string): Observable<any[]> {
      const url = `${this.configService.lrUrl}/datacity/${query}`;
      return this.http.get<any[]>(url);
    }
    searchtocity(query: string): Observable<any[]> {
      const url = `${this.configService.lrUrl}/datatocity/${query}`;
      return this.http.get<any[]>(url);
    }

    selectCont(consignorId: string): Observable<any[]> {
      const url = `${this.configService.lrUrl}/selectcont/${consignorId}`;
      return this.http.get<any[]>(url);
    }
    fetchPickDel(consignorId: string): Observable<any[]> {
      const url = `${this.configService.lrUrl}/PickDel/${consignorId}`;
      return this.http.get<any[]>(url);
    }

    fetchratetype(consignorId: string): Observable<any[]> {
      const url = `${this.configService.lrUrl}/ratetype/${consignorId}`;
      return this.http.get<any[]>(url); 
    }


}
