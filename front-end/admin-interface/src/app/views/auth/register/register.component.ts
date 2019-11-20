import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from './../../../shared/common/common.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(private commonService: CommonService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      re_pass: [''],
      email: ['', Validators.email],
      phone: [''],
    });
  }

  onSubmit() {
    if (this.registerForm.get('name').value
      || this.registerForm.get('password').value
      || this.registerForm.get('re_pass').value
      || this.registerForm.get('email').value
      || this.registerForm.get('phone').value) {
      // return false;
    }

    this.commonService.doPost('auth/register', this.registerForm.value)
      .subscribe(
        (data) => {
          console.log(data)
        }
      )
  }

}
