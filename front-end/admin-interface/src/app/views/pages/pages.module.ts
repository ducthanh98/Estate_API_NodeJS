import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { AmentitiesComponent } from './amentities/amentities.component';
import { SharedModule } from './../../shared/shared.module';
import { CommonService } from './../../shared/common/common.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [AmentitiesComponent],
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
    CommonService
  ], exports: [
    ModalModule
  ]
})
export class PagesModule { }
