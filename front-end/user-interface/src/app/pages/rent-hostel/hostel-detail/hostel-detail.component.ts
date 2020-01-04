import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonService } from './../../../shared/services/common.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { IBody } from '../../../shared/interfaces/body.interface';
import { IResponse } from '../../../shared/interfaces/Iresponse.interface';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Routes, Router } from '@angular/router';
import { HostelModel, AmentitiesModel } from './models/hostel-detai.model';
import { CommentRO } from './models/comment.model';
import { AuthService } from './../../../auth/auth.service';
@Component({
  selector: 'app-hostel-detail',
  templateUrl: './hostel-detail.component.html',
  styleUrls: ['./hostel-detail.component.css']
})
export class HostelDetailComponent implements OnInit, AfterViewInit {
  public Editor = ClassicEditor;
  pageNumber = 1;
  hostelData: any = {};
  existAmentities = [];
  lstComments = [];
  totalPages = 1;
  id: number;
  comment = '';
  userId = -1;
  isLogged = false;
  lstReportType = [];
  constructor(
    private commonService: CommonService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router) {
  }

  ngOnInit() {
    this.isLogged = this.authService.loggedInToken();

    this.id = +this.route.snapshot.paramMap.get('id');
    if (this.authService.loggedInToken()) {
      this.userId = this.authService.userInfo.id;
    }
    this.getHostelDetail();
    this.getLstComment();
    this.getListReport();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.commonService.generateScript();
    }, 800);
  }
  getHostelDetail() {
    this.commonService.doGet<IResponse<any>>(`rent-hostel/getById/${this.id}`)
      .subscribe(
        (res: IResponse<HostelModel>) => {
          if (res.statusCode === 0) {
            this.hostelData = res.data;
            for (const amentities of this.hostelData.amentities) {
              this.existAmentities.push(amentities.id);
            }
            this.getLstAmentities();
          } else {
            this.hostelData = {};
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.message);
        }
      );
  }

  getLstAmentities() {
    this.commonService.doGet<IResponse<any>>(`admin/amentities/getAll`)
      .subscribe(
        (res: IResponse<AmentitiesModel[]>) => {
          if (res.statusCode === 0) {
            this.hostelData.amentities = res.data;
          } else {
            this.hostelData = {};
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.message);
        }
      );
  }

  getLstComment() {
    const body: IBody = {
      pageSize: 999,
      pageNumber: this.pageNumber,
      keyText: ''
    };
    this.commonService.doPost<IResponse<any>>(`comments/getAllBy/${this.id}`, body)
      .subscribe(
        (res: IResponse<CommentRO>) => {
          if (res.statusCode === 0) {
            this.lstComments = res.data.list;
            this.totalPages = res.data.total;
          } else {
            this.hostelData = {};
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.message);
        }
      );
  }
  getListReport() {
    const body: IBody = {
      pageSize: 999,
      pageNumber: this.pageNumber,
      keyText: ''
    };
    this.commonService.doPost<IResponse<any>>(`admin/report-type/getAllBy/`, body)
      .subscribe(
        (res: IResponse<CommentRO>) => {
          if (res.statusCode === 0) {
            this.lstReportType = res.data.list;
            console.log(this.lstReportType)
          } else {
            this.lstReportType = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.message);
        }
      );
  }
  submitComment() {
    if (!this.comment) {
      this.toastrService.error('Comment must be not empty');
      return;
    }
    const body = {
      comment: this.comment,
      postId: this.id
    }
    this.commonService.doPost(`comments/create`, body)
      .subscribe(
        (res: IResponse<CommentRO>) => {
          if (res.statusCode === 0) {
            this.toastrService.success(res.message);
            this.comment = '';
            this.getLstComment();
          } else {
            this.hostelData = {};
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.message);
        }
      );
  }
  reportPost(reportTypeId) {
    if (!this.isLogged) {
      this.toastrService.error('Please login to report');
      this.router.navigate(['/auth/login']);
      return;
    }
    const body = {
      reportTypeId,
      postId: this.id
    }
    this.commonService.doPost(`admin/report/create`, body)
      .subscribe(
        (res: any) => {
          if (res.statusCode === 0) {
            this.toastrService.success(res.message);
          } else {
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.message);
        }
      )
  }

}
