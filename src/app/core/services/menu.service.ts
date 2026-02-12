import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuItem, MenuConfig, DrinkOption, CalculatePriceRequest, CalculatePriceResponse } from '../models/menu.model';
import { Page, PageParams } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1/menus`;

  getMenuItems(params?: PageParams): Observable<Page<MenuItem>> {
    return this.http.get<Page<MenuItem>>(`${this.base}/items`, { params: this.buildParams(params) });
  }

  getItemConfig(itemId: number): Observable<MenuConfig> {
    return this.http.get<MenuConfig>(`${this.base}/items/${itemId}/config`);
  }

  getDrinks(itemId: number): Observable<DrinkOption[]> {
    return this.http.get<DrinkOption[]>(`${this.base}/drinks`, {
      params: new HttpParams().set('itemId', itemId)
    });
  }

  calculatePrice(payload: CalculatePriceRequest): Observable<CalculatePriceResponse> {
    return this.http.post<CalculatePriceResponse>(`${this.base}/calculate-price`, payload);
  }

  private buildParams(params?: PageParams): HttpParams {
    let p = new HttpParams();
    if (params?.page !== undefined) p = p.set('page', params.page);
    if (params?.size !== undefined) p = p.set('size', params.size);
    if (params?.sortBy) p = p.set('sortBy', params.sortBy);
    if (params?.sortDir) p = p.set('sortDir', params.sortDir);
    return p;
  }
}
