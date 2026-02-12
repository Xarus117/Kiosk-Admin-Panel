import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, CreateOrderRequest } from '../models/order.model';
import { Page, PageParams } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1/orders`;

  getAll(params?: PageParams): Observable<Page<Order>> {
    return this.http.get<Page<Order>>(this.base, { params: this.buildParams(params) });
  }

  getByStatus(status: string, params?: PageParams): Observable<Page<Order>> {
    return this.http.get<Page<Order>>(`${this.base}/status/${status}`, { params: this.buildParams(params) });
  }

  getByUser(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/user/${userId}`);
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.base}/${id}`);
  }

  getByNumber(orderNumber: string): Observable<Order> {
    return this.http.get<Order>(`${this.base}/number/${orderNumber}`);
  }

  create(order: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.base, order);
  }

  updateStatus(id: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.base}/${id}/status`, null, {
      params: new HttpParams().set('status', status)
    });
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
