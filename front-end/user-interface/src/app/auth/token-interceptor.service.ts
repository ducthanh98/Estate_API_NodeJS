import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private _injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this._injector.get(AuthService);
    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.token}`
      }
    });
    return next.handle(tokenizedReq)
      .pipe(
        tap((event: HttpEvent<any>) => { }, (err: any) => {

          if (err instanceof HttpErrorResponse) {
            // do error handling here
            if (err.status === 403 || err.status === 401) {
              const router = this._injector.get(Router);
              router.navigate(['/auth/login'], { skipLocationChange: true });
            }
            throw err;
          }
        })
      );
  }
}
