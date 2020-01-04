import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { AmentitiesComponent } from './amentities/amentities.component';
import { SharedModule } from './../../shared/shared.module';
import { CommonService } from './../../shared/common/common.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReportComponent } from './report/report.component';
import { ReportTypeComponent } from './report-type/report-type.component';
import { TokenInterceptorService } from '../auth/token-interceptor.service';
import { UserComponent } from './user/user.component';



@NgModule({
  declarations: [AmentitiesComponent, ReportComponent, ReportTypeComponent, UserComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot()
  ],
  providers: [
    CommonService,
    {
      provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true
    }
  ], exports: [
    ModalModule
  ]
})
export class PagesModule { }
