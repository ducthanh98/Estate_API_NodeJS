import { Injectable, Renderer2, Inject, RendererFactory2 } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { WebConstants } from './../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private baseUrl = 'http://localhost:3000/api/';
  private renderer: Renderer2;
  private listJsUrl = [
    './assets/js/main.js',
    './assets/js/pages/property-detail.js'
  ];
  constructor(
    private http: HttpClient,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    private toastrService: ToastrService
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }


  doGet<T>(url: string, header?: HttpHeaders, params?: HttpParams): Observable<T> {
    const requestUrl = `${this.baseUrl}${url}`;
    return this.http.get<T>(requestUrl, { headers: header, params });
  }

  doPost<T>(url: string, body: any, header?: HttpHeaders, params?: HttpParams): Observable<T> {
    const requestUrl = `${this.baseUrl}${url}`;
    return this.http.post<T>(requestUrl, body, {
      headers: header,
      params
    });
  }
  generateScript() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.listJsUrl.length; i++) {
      const script = this.renderer.createElement('script');
      script.src = this.listJsUrl[i];
      this.renderer.appendChild(this.document.body, script);
    }
  }
  errorHandler(err) {
    if (err.errors) {
      this.toastrService.error(err.errors.message);
    } else if (err.status === 0) {
      this.toastrService.error(WebConstants.SERVER_MAINTAIN);
    } else {
      this.toastrService.error(err.message);
    }
  }
  get token() {
    return localStorage.getItem(WebConstants.ACCESS_TOKEN);
  }

  get userInfo() {
    return JSON.parse(localStorage.getItem(WebConstants.USER_INFO));
  }
}
