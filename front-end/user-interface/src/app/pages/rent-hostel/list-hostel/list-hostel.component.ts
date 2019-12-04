import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonService } from './../../../shared/services/common.service';
import { IBody } from 'src/app/shared/interfaces/body.interface';
import { IResponse } from 'src/app/shared/interfaces/Iresponse.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-hostel',
  templateUrl: './list-hostel.component.html',
  styleUrls: ['./list-hostel.component.css']
})
export class ListHostelComponent implements OnInit, AfterViewInit {
  pageNumber = 1;
  lstHostel = [];
  totalPages = 1;
  constructor(
    private commonService: CommonService,
    private toastrService: ToastrService) { }

  ngOnInit() {
    this.getLstHostel();
  }
  ngAfterViewInit(): void {
    this.commonService.generateScript();
  }

  getLstHostel() {
    const body: IBody = {
      pageSize: 10,
      pageNumber: this.pageNumber,
      keyText: ''
    };
    this.commonService.doPost<IResponse<any>>('rent-hostel/getAllBy', body)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.lstHostel = res.data.list;
            this.totalPages = Math.ceil(res.data.total / 10);
          } else {
            this.lstHostel = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.message);
        }
      );
  }

}
