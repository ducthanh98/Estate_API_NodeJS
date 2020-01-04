import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportTypeEntity, ReportType } from '../report-type/report-type.model';
import { WebConstants } from '../../../shared/constants/constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../../shared/common/common.service';
import { ToastrService } from 'ngx-toastr';
import { IBody } from '../../../shared/interfaces/body.interface';
import { IResponse } from '../../../shared/interfaces/Iresponse.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  pageNumber = 1;
  totalPages = 1;
  pageSize = WebConstants.PAGE_SIZE;
  reportData = [];
  private baseUrl = 'admin/report';
  private id: number = null;

  constructor(
    private commonService: CommonService,
    private toastrService: ToastrService) { }
  ngOnInit(): void {
    this.getData();
  }
  getData(pageNumber = this.pageNumber) {
    this.pageNumber = pageNumber;
    const body: IBody = {
      pageSize: 10,
      pageNumber: pageNumber,
      keyText: ''
    };
    this.commonService.doPost<IResponse<any>>(`${this.baseUrl}/getAllBy`, body)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.reportData = res.data.list;
            this.totalPages = Math.ceil(res.data.total / 10);
          } else {
            this.reportData = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        }
      );
  }
  confirmReport(report, status) {
    const body = { status, postId: report.post.id };
    this.commonService.doPost<IResponse<any>>(`${this.baseUrl}/update/${report.id}`, body)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.toastrService.success(res.message);
            this.getData();
          } else {
            this.reportData = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        }
      );
  }
}
