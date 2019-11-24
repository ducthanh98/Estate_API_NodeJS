import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';

import { PagesRoutingModule, pageRoutingComponent } from './pages-routing.module';
import { LayoutModule } from '../layout/layout.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../auth/token-interceptor.service';

@NgModule({
  declarations: [
    PagesComponent,
    ...pageRoutingComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    LayoutModule
  ], providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true
    }
  ]
})
export class PagesModule { }
