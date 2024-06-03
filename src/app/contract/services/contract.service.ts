import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ConfigService } from "../../core/config/config.service";
import { Contract } from "../models/contract.model";

@Injectable({
  providedIn: "root",
})
export class ContractService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getContracts(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());
  
    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }
  
    const url = `${this.configService.contractUrl}/AllContract`;
    return this.http.get<any>(url, { params });
  }
  getContractById(contract_id: number): Observable<any> {
    return this.http.get<any>(`${this.configService.contractUrl}/AllContract/${contract_id}`);
  }
  geServiceById(contract_id: number): Observable<any> {
    return this.http.get<any>(`${this.configService.contractUrl}/service/${contract_id}`);
  }
  
  getExcessById(contract_id: number): Observable<any>
  {
    return this.http.get<any>(`${this.configService.contractUrl}/Excess/${contract_id}`);

  }
  getdoordeliveryById(contract_id: number): Observable<any>
  {
    return this.http.get<any>(`${this.configService.contractUrl}/doordelivery/${contract_id}`);

  }
  createContract(contract: any): Observable<any> {
    return this.http.post<any>(`${this.configService.contractUrl}/AllContract`, contract); // Adjusted URL for creating contracts
  }
  
  deactivateTenant(contract_id: any): Observable<any> {
    return this.http.patch<any>(`${this.configService.contractUrl}/AllContract/${contract_id}/deactivate`, null);
  }
  

// Update the updateContract method in your service
updateContract(selectedContractId : any, contractData: any): Observable<any> {
  return this.http.put<any>(`${this.configService.contractUrl}/AllContract/${selectedContractId }`, contractData);
}
updatedoordelivery(contract_id: number, transformedData: any): Observable<any> {
  return this.http.put<any>(`${this.configService.contractUrl}/doordelivery/${contract_id }`, transformedData);
}

  searchCustomers(query: string): Observable<any[]> {
    const url = `${this.configService.contractUrl}/AllContract/data/${query}`;
    return this.http.get<any[]>(url);
}
createService(serviceData: any): Observable<any> {
  const url = `${this.configService.contractUrl}/service`;
  return this.http.post<any>(url, serviceData);
}

updateService(contract_id: number, servicedata: any): Observable<any> {
  const url = `${this.configService.contractUrl}/service/${contract_id}`;
  return this.http.put<any>(url, servicedata);
}

createExcess(excessFormData: any): Observable<any> {
  const url = `${this.configService.contractUrl}/Excess`;
  return this.http.post<any>(url, excessFormData); // Adjusted here
}
fetchDataBySapCustCode(data: any): Observable<any>{
  const url = `${this.configService.contractUrl}/AllContract/fetchbySapCustCode/${data}`;
    return this.http.get<any[]>(url);
}


searchfromCity(query: string): Observable<any[]> {
  const url = `${this.configService.lrUrl}/datacity/${query}`;
  return this.http.get<any[]>(url);
}

  
}
