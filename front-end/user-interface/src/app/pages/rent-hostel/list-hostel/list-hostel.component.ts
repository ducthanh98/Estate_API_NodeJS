import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonService } from './../../../shared/services/common.service';
import { IBody } from 'src/app/shared/interfaces/body.interface';
import { IResponse } from 'src/app/shared/interfaces/Iresponse.interface';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../../auth/auth.service';

@Component({
  selector: 'app-list-hostel',
  templateUrl: './list-hostel.component.html',
  styleUrls: ['./list-hostel.component.css']
})
export class ListHostelComponent implements OnInit, AfterViewInit {
  pageNumber = 1;
  lstHostel = [];
  totalPages = 1;
  userInfo: any;
  constructor(
    private commonService: CommonService,
    private toastrService: ToastrService,
    private authService: AuthService) { }

  ngOnInit() {
    this.getLstHostel();
    this.userInfo = this.authService.userInfo;
    console.log(this.userInfo)
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
  searchAdvanced() {
    const body = {
      title: (document.getElementById('title') as HTMLInputElement).value,
      location: (document.getElementById('location') as HTMLInputElement).value,
      bedroom: +(document.getElementById('bedroom') as HTMLInputElement).value,
      bathroom: +(document.getElementById('bathroom') as HTMLInputElement).value,
      minArea: +(document.getElementById('minArea') as HTMLInputElement).innerText,
      maxArea: +(document.getElementById('maxArea') as HTMLInputElement).innerText,
      minPrice: +(document.getElementById('minPrice') as HTMLInputElement).innerText,
      maxPrice: +(document.getElementById('maxPrice') as HTMLInputElement).innerText,
    };
    this.commonService.doPost<IResponse<any>>('rent-hostel/searchAdvanced', body)
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
