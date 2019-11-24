import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad, Route } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})

@Injectable()
export class AuthguardtokenGuard implements CanActivate, CanLoad {
  constructor(private _authService: AuthService, private _router: Router) { }

  canActivate(): boolean {
    if (this._authService.loggedInToken()) {
      return true;
    } else {
      this._router.navigate(['/auth/login']);
      return false;
    }
  }
  canLoad(route: Route): boolean {
    if (this._authService.loggedInToken()) {
      return true;
    } else {
      this._router.navigate(['/auth/login']);
      return false;
    }
  }

}
