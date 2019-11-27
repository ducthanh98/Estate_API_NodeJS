import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { RentHostelRoutingModule } from './rent-hostel-routing.module';
import { ListHostelComponent } from './list-hostel/list-hostel.component';
import { FormHostelComponent } from './form-hostel/form-hostel.component';


@NgModule({
  declarations: [ListHostelComponent, FormHostelComponent],
  imports: [
    CommonModule,
    RentHostelRoutingModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RentHostelModule { }
