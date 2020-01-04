import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonService } from '../../shared/common/common.service';
import { VerifyComponent } from './verify/verify.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    CommonService
  ]
})
export class AuthModule { }
