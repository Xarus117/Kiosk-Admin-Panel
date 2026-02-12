import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction, ProcessPaymentRequest } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1/payments`;

  getOrderTransactions(orderId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.base}/order/${orderId}`);
  }

  processPayment(payload: ProcessPaymentRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.base}/process`, payload);
  }

  refund(orderId: number, amount?: number): Observable<Transaction> {
    let params = new HttpParams();
    if (amount !== undefined) params = params.set('amount', amount);
    return this.http.post<Transaction>(`${this.base}/refund/${orderId}`, null, { params });
  }
}
