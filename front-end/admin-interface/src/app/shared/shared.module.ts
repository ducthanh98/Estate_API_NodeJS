import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [PaginationComponent, ConfirmDialogComponent],
  imports: [
    ModalModule.forRoot(),
    CommonModule
  ],
  exports: [PaginationComponent, ConfirmDialogComponent]
})
export class SharedModule { }
