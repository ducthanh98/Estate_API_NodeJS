import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonService } from './../../../shared/common/common.service';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from './../../../shared/interfaces/Iresponse.interface';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AmentitiesEntity, Amentities } from './amentities.model';
import { IBody } from './../../../shared/interfaces/body.interface';
import { ConfirmDialogComponent } from './../../../shared/components/confirm-dialog/confirm-dialog.component';
import { WebConstants } from '../../../shared/constants/constants';

@Component({
  selector: 'app-amentities',
  templateUrl: './amentities.component.html',
  styles: [
    `
      .icon-action:hover{
        color: #4e9c09;
        cursor:pointer;
      }
    `
  ]
})
export class AmentitiesComponent implements OnInit, AfterViewInit {
  amentitiesData: AmentitiesEntity[] = [];
  pageNumber = 1;
  totalPages = 1;
  pageSize = WebConstants.PAGE_SIZE;
  amentitiesForm: FormGroup;
  private amentitiesUrl = 'admin/amentities';
  private id: number = null;
  @ViewChild('amentitiesModal') public amentitiesModal: ModalDirective;
  @ViewChild(ConfirmDialogComponent) confirmModal: ConfirmDialogComponent;

  constructor(private commonService: CommonService,
    private toastrService: ToastrService,
    private fb: FormBuilder, ) { }

  ngOnInit() {
    this.initForm();
    this.getAmentitiesData();
  }
  ngAfterViewInit() {
    this.amentitiesModal.onHidden.subscribe(
      () => { this.amentitiesForm.reset(); }
    );
  }
  initForm() {
    this.amentitiesForm = this.fb.group({
      name: ['', Validators.required],
      icon: ['', Validators.required]
    });

  }
  getAmentitiesData(pageNumber = this.pageNumber) {
    this.pageNumber = pageNumber;
    const body: IBody = {
      pageSize: 10,
      pageNumber: pageNumber,
      keyText: ''
    };
    this.commonService.doPost<IResponse<Amentities>>('admin/amentities/getAllBy', body)
      .subscribe(
        (res: IResponse<Amentities>) => {
          if (res.statusCode === 0) {
            this.amentitiesData = res.data.list;
            this.totalPages = Math.ceil(res.data.total / 10);
          } else {
            this.amentitiesData = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        }
      );
  }
  onSubmit() {
    if (this.amentitiesForm.invalid) {
      this.toastrService.error('Please fill all the field');
      return false;
    }
    const body: Amentities = { ...this.amentitiesForm.value };
    let url = '';
    if (this.id) {
      url = `${this.amentitiesUrl}/update/${this.id}`;
    } else {
      url = `${this.amentitiesUrl}/create`;
    }
    this.commonService.doPost<IResponse<any>>(url, body)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.toastrService.success(res.message);
            this.amentitiesModal.hide();
            this.getAmentitiesData();
          } else {
            this.toastrService.error(res.message);
          }
        }, (err: HttpErrorResponse) => {
          this.toastrService.error(err.message);
        }
      );
  }
  openModal(id: number) {
    this.amentitiesModal.show();
    this.id = id;
    if (id) {
      const data = this.amentitiesData.filter(x => x.id === id)[0];
      this.amentitiesForm.patchValue({
        name: data.name,
        icon: data.icon
      });
    }
  }
  openConfirm(id: number) {
    this.confirmModal.openModal();
    this.id = id;
  }
  deleteAmentities(isDelete: boolean) {
    if (!isDelete) {
      return this.confirmModal.closeModal();
    }
    const url = `${this.amentitiesUrl}/delete/${this.id}`;
    this.commonService.doGet<IResponse<any>>(url)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.toastrService.success(res.message);
            this.confirmModal.closeModal();
            this.getAmentitiesData();
          } else {
            this.toastrService.error(res.message);
          }
        }, (err: HttpErrorResponse) => {
          this.toastrService.error(err.message);
        }
      );
  }
}
