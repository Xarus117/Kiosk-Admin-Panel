import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Modifier } from '../models/modifier.model';
import { Page, PageParams } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class ModifierService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1/modifiers`;

  getAll(params?: PageParams): Observable<Page<Modifier>> {
    return this.http.get<Page<Modifier>>(this.base, { params: this.buildParams(params) });
  }

  getAvailable(params?: PageParams): Observable<Page<Modifier>> {
    return this.http.get<Page<Modifier>>(`${this.base}/available`, { params: this.buildParams(params) });
  }

  getByType(type: string): Observable<Modifier[]> {
    return this.http.get<Modifier[]>(`${this.base}/type/${type}`);
  }

  getById(id: number): Observable<Modifier> {
    return this.http.get<Modifier>(`${this.base}/${id}`);
  }

  create(modifier: Partial<Modifier>): Observable<Modifier> {
    return this.http.post<Modifier>(this.base, modifier);
  }

  update(id: number, modifier: Partial<Modifier>): Observable<Modifier> {
    return this.http.put<Modifier>(`${this.base}/${id}`, modifier);
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
