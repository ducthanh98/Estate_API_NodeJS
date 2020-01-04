import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { IResponse } from '../../shared/interfaces/Iresponse.interface';
import { WebConstants } from '../../shared//constants/constants';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  constructor(
    private commonService: CommonService,
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
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      re_pass: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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
    if (this.registerForm.invalid) {
      this.toastrService.error('Please fill the form .');
      return false;
    }
    const body = this.registerForm.value;
    delete body.re_pass;

    this.commonService.doPost('auth/register', body)
      .subscribe(
        (data: IResponse<any>) => {
          if (data.statusCode === 0) {
            this.toastrService.success(data.message);
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
          } else {
            this.toastrService.error(data.message);
          }
        },
        (err: any) => {
          this.commonService.errorHandler(err);
        }
      );
  }

}
