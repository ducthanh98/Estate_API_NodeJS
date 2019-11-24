import { Injectable } from '@angular/core';
import { WebConstants } from '../shared/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInToken() {
    const token = localStorage.getItem(WebConstants.ACCESS_TOKEN);
    if (token) {
      return true;
    } else {
      return false;
    }
  }
  get token() {
    return localStorage.getItem(WebConstants.ACCESS_TOKEN);
  }

  get userInfo() {
    return JSON.parse(localStorage.getItem(WebConstants.USER_INFO));
  }
  checkPermission(): boolean {
    const user = this.userInfo;
    if (!user || +user.role > 1) {
      return false;
    }
    return true;
  }
}
