import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ContractPaymentType } from "../models/contractpaymenttype.model";
import { ConfigService } from "../../core/config/config.service";

@Injectable({
  providedIn: 'root'
})
export class ContractPaymentTypeService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Fetches ContractPaymentType types with pagination and filters
  getContractPaymentTypes(page: number, perPage: number, filters: any): Observable<ContractPaymentType[]> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<ContractPaymentType[]>(this.configService.paymenttypeUrl, { params });
  }

  // Fetches a single paymenttype type by id
  getContractPaymentTypeById(id: number): Observable<ContractPaymentType> {
    return this.http.get<ContractPaymentType>(`${this.configService.paymenttypeUrl}/${id}`);
  }

  // Creates a new paymenttype type
  createContractPaymentType(paymenttype: ContractPaymentType): Observable<ContractPaymentType> {
    return this.http.post<ContractPaymentType>(this.configService.paymenttypeUrl, paymenttype);
  }

  // Updates an existing paymenttype type
  updateContractPaymentType(id: number, paymenttype: ContractPaymentType): Observable<ContractPaymentType> {
    return this.http.put<ContractPaymentType>(
      `${this.configService.paymenttypeUrl}/${id}`,
      paymenttype
    );
  }

  // Deactivates a paymenttype type
  deactivateContractPaymentType(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.paymenttypeUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a paymenttype type
  deleteContractPaymentType(id: number): Observable<any> {
    return this.http.delete(`${this.configService.paymenttypeUrl}/${id}`);
  }
}
