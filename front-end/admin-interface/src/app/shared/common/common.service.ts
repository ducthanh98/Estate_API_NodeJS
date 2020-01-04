import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private baseUrl = 'http://localhost:3000/api/';
  constructor(private http: HttpClient) { }


  doGet<T>(url: string, header?: HttpHeaders, params?: HttpParams): Observable<T> {
    const requestUrl = `${this.baseUrl}${url}`;
    return this.http.get<T>(requestUrl, { headers: header, params: params });
  }

  doPost<T>(url: string, body: any, header?: HttpHeaders, params?: HttpParams): Observable<T> {
    const requestUrl = `${this.baseUrl}${url}`;
    return this.http.post<T>(requestUrl, body, {
      headers: header,
      params: params
    });
  }
}
