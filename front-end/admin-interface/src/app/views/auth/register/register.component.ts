import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from './../../../shared/common/common.service';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from './../../../shared/interfaces/Iresponse.interface';
import { WebConstants } from '../../../shared/constants/constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.initForm();
    localStorage.removeItem(WebConstants.ACCESS_TOKEN);
    localStorage.removeItem(WebConstants.USER_INFO);
  }

  initForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      re_pass: ['', Validators.required],
      email: ['', Validators.email],
      phone: [''],
    },
      {
        validators: this.comparePassword
      });
  }
  comparePassword(c: AbstractControl) {
    const v = c.value;
    return (v.password === v.re_pass) ? null : {
      passwordnotmatch: true
    };
  }
  onSubmit() {
    if (!this.registerForm.get('name').value
      || !this.registerForm.get('password').value
      || !this.registerForm.get('re_pass').value
      || !this.registerForm.get('email').value
      || !this.registerForm.get('phone').value) {
      this.toastrService.error('Please fill the form .');
      return false;
    }
    const body = this.registerForm.value;
    delete body['re_pass'];

    this.commonService.doPost('auth/register', body)
      .subscribe(
        (data: IResponse<any>) => {
          if (data.statusCode === 0) {
            this.toastrService.success(data.message);
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 5000);
          } else {
            this.toastrService.error(data.message);
          }
        },
        (err: any) => {
          this.toastrService.error(err.error.message);
        }
      );
  }

}
