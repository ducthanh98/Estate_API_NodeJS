import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
  @Output() delete = new EventEmitter<boolean>();
  @ViewChild('confirm') public confirmModal: ModalDirective;
  openModal() {
    this.confirmModal.show();
  }
  closeModal() {
    this.confirmModal.hide();
  }
  emitDeleteEvent(isDelete: boolean) {
    this.delete.emit(isDelete);
  }

}
