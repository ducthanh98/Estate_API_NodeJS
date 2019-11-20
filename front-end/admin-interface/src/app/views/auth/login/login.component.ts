import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../shared/common/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IResponse } from '../../../shared/interfaces/Iresponse.interface';
import { WebConstants } from './../../../shared/constants/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private commonService: CommonService, private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', [Validators.minLength(8), Validators.maxLength(16)]]
    });
  }

  onSubmit() {
    console.log(this.loginForm.value)
    this.commonService.doPost('auth/login', this.loginForm.value)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            localStorage.setItem(WebConstants.ACCESS_TOKEN, res.data[WebConstants.ACCESS_TOKEN]);
            localStorage.setItem(WebConstants.USER_INFO, JSON.stringify(res.data[WebConstants.USER_INFO]));
          }
          console.log(res);
        }, (err) => {
          console.log(err)
        }
      )
  }

}
