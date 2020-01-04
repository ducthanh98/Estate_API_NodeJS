import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonService } from './../../../shared/common/common.service';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from './../../../shared/interfaces/Iresponse.interface';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { IBody } from './../../../shared/interfaces/body.interface';
import { ConfirmDialogComponent } from './../../../shared/components/confirm-dialog/confirm-dialog.component';
import { WebConstants } from '../../../shared/constants/constants';
import { ReportTypeEntity, ReportType } from './report-type.model';


@Component({
  selector: 'app-report-type',
  templateUrl: './report-type.component.html',
  styles: [
    `
    .icon-action:hover{
      color: #4e9c09;
      cursor:pointer;
    }
    `
  ]
})
export class ReportTypeComponent implements OnInit, AfterViewInit {

  reportData: ReportTypeEntity[] = [];
  pageNumber = 1;
  totalPages = 1;
  pageSize = WebConstants.PAGE_SIZE;
  form: FormGroup;
  private baseUrl = 'admin/report-type';
  private id: number = null;
  @ViewChild('modal') public modal: ModalDirective;
  @ViewChild(ConfirmDialogComponent) confirmModal: ConfirmDialogComponent;

  constructor(private commonService: CommonService,
    private toastrService: ToastrService,
    private fb: FormBuilder, ) { }

  ngOnInit() {
    this.initForm();
    this.getData();
  }
  ngAfterViewInit() {
    this.modal.onHidden.subscribe(
      () => { this.form.reset(); }
    );
  }
  initForm() {
    this.form = this.fb.group({
      reportContent: ['', Validators.required],
    });

  }
  getData(pageNumber = this.pageNumber) {
    this.pageNumber = pageNumber;
    const body: IBody = {
      pageSize: 10,
      pageNumber: pageNumber,
      keyText: ''
    }
    this.commonService.doPost<IResponse<ReportType>>(`${this.baseUrl}/getAllBy`, body)
      .subscribe(
        (res: IResponse<ReportType>) => {
          if (res.statusCode === 0) {
            this.reportData = res.data.list;
            this.totalPages = Math.ceil(res.data.total / 10);
          } else {
            this.reportData = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          console.log(err)
          this.toastrService.error(err.message);
        }
      );
  }
  onSubmit() {
    if (this.form.invalid) {
      return false;
    }
    const body: ReportTypeEntity = { ...this.form.value };
    let url = '';
    if (this.id) {
      url = `${this.baseUrl}/update/${this.id}`;
    } else {
      url = `${this.baseUrl}/create`;
    }
    this.commonService.doPost<IResponse<any>>(url, body)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.toastrService.success(res.message);
            this.modal.hide();
            this.getData();
          } else {
            this.toastrService.error(res.message);
          }
        }, (err: HttpErrorResponse) => {
          this.toastrService.error(err.message);
        }
      );
  }
  openModal(id: number) {
    this.modal.show();
    this.id = id;
    if (id) {
      const data = this.reportData.filter(x => x.id === id)[0];
      this.form.patchValue({
        reportContent: data.reportContent,
      });
    }
  }
  openConfirm(id: number) {
    this.confirmModal.openModal();
    this.id = id;
  }
  delete(isDelete: boolean) {
    if (!isDelete) {
      return this.confirmModal.closeModal();
    }
    const url = `${this.baseUrl}/delete/${this.id}`;
    this.commonService.doGet<IResponse<any>>(url)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.toastrService.success(res.message);
            this.confirmModal.closeModal();
            this.getData();
          } else {
            this.toastrService.error(res.message);
          }
        }, (err: HttpErrorResponse) => {
          this.toastrService.error(err.message);
        }
      );
  }

}
