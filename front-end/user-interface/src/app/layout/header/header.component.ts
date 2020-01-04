import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonService } from './../../shared/services/common.service';
import { IResponse } from 'src/app/shared/interfaces/Iresponse.interface';
import { WebConstants } from 'src/app/shared/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  infoUrl: string;
  updateUrl: string;
  userInfoForm: FormGroup;
  changePassForm: FormGroup;
  email: string;
  isHome = true;
  isLogged = false;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private router: Router,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.isLogged = this.authService.loggedInToken();
    this.initForm();
    this.isHome = this.router.url.includes('home');
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.isHome = this.router.url.includes('home');
        }
      }
    );
  }
  initForm() {
    if (this.isLogged) {
      const data = this.commonService.userInfo;
      this.email = data.Email;
      this.infoUrl = `auth/updateInfo/${data.id}`;
      this.updateUrl = `auth/updatePassword/${data.id}`;
      this.userInfoForm = this.fb.group({
        name: [data.name, [Validators.required]],
        phone: [data.phone, [Validators.required]],
        facebook: [data.facebook],
        skype: [data.skype]
      });
      this.changePassForm = this.fb.group({
        oldPass: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
        re_pass: ['', [Validators.required]],
      },
        {
          validators: this.comparePassword
        });
    }
  }

  comparePassword(c: AbstractControl) {
    const v = c.value;
    return (v.password === v.re_pass) ? null : {
      passwordnotmatch: true
    };
  }

  updateUserInfo() {
    this.commonService.doPost(this.infoUrl, { ...this.userInfoForm.value })
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.toastrService.success(res.message);
            setTimeout(
              () => { this.router.navigate(['/auth/login']); }, 1500
            );

          } else {
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.commonService.errorHandler(err);
        }
      );
  }
  updatePass() {
    const body = { ...this.changePassForm.value };
    delete body.re_pass;
    this.commonService.doPost(this.updateUrl, body)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.toastrService.success(res.message);
            setTimeout(
              () => { this.router.navigate(['/auth/login']); }, 1500
            );

          } else {
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.commonService.errorHandler(err);
        }
      );
  }
}
