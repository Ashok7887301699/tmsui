import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ConfigService } from "../../core/config/config.service";
import { ProductType } from "../models/producttype.model";


@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {

  constructor(private http: HttpClient, private configService: ConfigService) { }

  // Fetches productType with pagination
  getProductTypes(page: number, perPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("per_page", perPage.toString());

    // Include other filters if provided
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }

    return this.http.get<any>(this.configService.productTypeUrl, { params });
  }

  // Fetches a single productType by id
  getProductTypeById(id: number): Observable<ProductType> {
    return this.http.get<ProductType>(`${this.configService.productTypeUrl}/${id}`);
  }

  // Creates a new productType
  createProductType(producttype: ProductType): Observable<ProductType> {
    return this.http.post<ProductType>(this.configService.productTypeUrl, producttype);
  }

  // Updates an existing productType
  updateProductType(id: number, producttype: ProductType): Observable<ProductType> {
    return this.http.put<ProductType>(
      `${this.configService.productTypeUrl}/${id}`,
      producttype
    );
  }

  // Deactivates a productType
  deactivateProductType(id: number): Observable<any> {
    return this.http.patch(
      `${this.configService.productTypeUrl}/${id}/deactivate`,
      null
    );
  }

  // Deletes a productType
  deleteProductType(id: number): Observable<any> {
    return this.http.delete(`${this.configService.productTypeUrl}/${id}`);
  }
}
