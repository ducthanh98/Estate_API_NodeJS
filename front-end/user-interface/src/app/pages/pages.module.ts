import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';

import { PagesRoutingModule, pageRoutingComponent } from './pages-routing.module';
import { LayoutModule } from '../layout/layout.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../auth/token-interceptor.service';
import { ContactComponent } from './contact/contact.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PagesComponent,
    ...pageRoutingComponent,
    ContactComponent,
  ],
  imports: [
  CommonModule,
    PagesRoutingModule,
    LayoutModule,
    FormsModule
  ]
})
export class PagesModule { }
