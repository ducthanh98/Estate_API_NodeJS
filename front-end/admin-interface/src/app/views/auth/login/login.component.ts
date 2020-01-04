import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../shared/common/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IResponse } from '../../../shared/interfaces/Iresponse.interface';
import { WebConstants } from './../../../shared/constants/constants';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private toastrService: ToastrService) { }

  ngOnInit() {
    localStorage.removeItem(WebConstants.ACCESS_TOKEN);
    localStorage.removeItem(WebConstants.USER_INFO);
    this.initForm();
  }
  initForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', [Validators.minLength(8), Validators.maxLength(16)]]
    });
  }

  onSubmit() {
    if (this.loginForm.get('email').value === '' || this.loginForm.get('password').value === '' || this.loginForm.invalid) {
      return false;
    }
    this.commonService.doPost('auth/login', this.loginForm.value)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            localStorage.setItem(WebConstants.ACCESS_TOKEN, res.data[WebConstants.ACCESS_TOKEN]);
            localStorage.setItem(WebConstants.USER_INFO, JSON.stringify(res.data[WebConstants.USER_INFO]));
            this.router.navigate(['/dashboard']);
          } else {
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.errors.message);
        }
      );
  }

}
