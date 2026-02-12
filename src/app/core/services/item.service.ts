import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Item } from '../models/item.model';
import { Page, PageParams } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1/items`;

  getAll(params?: PageParams): Observable<Page<Item>> {
    return this.http.get<Page<Item>>(this.base, { params: this.buildParams(params) });
  }

  getAvailable(params?: PageParams): Observable<Page<Item>> {
    return this.http.get<Page<Item>>(`${this.base}/available`, { params: this.buildParams(params) });
  }

  getByCategory(categoryId: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.base}/category/${categoryId}`);
  }

  getById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.base}/${id}`);
  }

  getBySku(sku: string): Observable<Item> {
    return this.http.get<Item>(`${this.base}/sku/${sku}`);
  }

  create(item: Partial<Item>): Observable<Item> {
    return this.http.post<Item>(this.base, item);
  }

  update(id: number, item: Partial<Item>): Observable<Item> {
    return this.http.put<Item>(`${this.base}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
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
