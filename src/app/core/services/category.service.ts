import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/category.model';
import { Page, PageParams } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1/categories`;

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.base);
  }

  getActive(params?: PageParams): Observable<Page<Category>> {
    return this.http.get<Page<Category>>(`${this.base}/active`, { params: this.buildParams(params) });
  }

  getRoot(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/root`);
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.base}/${id}`);
  }

  create(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.base, category);
  }

  update(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.base}/${id}`, category);
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
