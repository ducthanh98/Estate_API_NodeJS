import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonService } from './../../../shared/services/common.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { IBody } from '../../../shared/interfaces/body.interface';
import { IResponse } from '../../../shared/interfaces/Iresponse.interface';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
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
  userId: number;
  constructor(
    private commonService: CommonService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.userId = this.authService.userInfo.id;
    this.getHostelDetail();
    this.getLstComment();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.commonService.generateScript();
    }, 200);
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
      )
  }

}
