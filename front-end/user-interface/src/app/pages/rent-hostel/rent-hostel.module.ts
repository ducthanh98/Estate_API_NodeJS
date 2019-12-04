import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { RentHostelRoutingModule } from './rent-hostel-routing.module';
import { ListHostelComponent } from './list-hostel/list-hostel.component';
import { FormHostelComponent } from './form-hostel/form-hostel.component';
import { PaginationComponent } from './../../shared/components/pagination/pagination.component';
import { HostelDetailComponent } from './hostel-detail/hostel-detail.component';


@NgModule({
  declarations: [ListHostelComponent, FormHostelComponent, PaginationComponent, HostelDetailComponent],
  imports: [
    CommonModule,
    RentHostelRoutingModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RentHostelModule { }
