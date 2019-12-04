import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonService } from './../../../shared/services/common.service';
import { IBody } from '../../../shared/interfaces/body.interface';
import { IResponse } from '../../../shared/interfaces/Iresponse.interface';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { HostelModel, AmentitiesModel } from './hostel-detai.model';
@Component({
  selector: 'app-hostel-detail',
  templateUrl: './hostel-detail.component.html',
  styleUrls: ['./hostel-detail.component.css']
})
export class HostelDetailComponent implements OnInit, AfterViewInit {
  pageNumber = 1;
  hostelData: any = {};
  existAmentities = [];
  totalPages = 1;
  id: number;
  constructor(
    private commonService: CommonService,
    private toastrService: ToastrService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.getHostelDetail();
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
            console.log(this.hostelData.amentities)
          } else {
            this.hostelData = {};
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.message);
        }
      );
  }

}
