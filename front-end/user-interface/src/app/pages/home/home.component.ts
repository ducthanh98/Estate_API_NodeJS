import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonService } from './../../shared/services/common.service';
import { AuthService } from './../../auth/auth.service';
import { IBody } from 'src/app/shared/interfaces/body.interface';
import { IResponse } from 'src/app/shared/interfaces/Iresponse.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  isLogin = false;
  lstHostel = [];
  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.isLogin = !!this.authService.token;
    this.getLstNewestHostel();
  }
  ngAfterViewInit(): void {
    this.commonService.generateScript();
  }

  getLstNewestHostel() {
    this.commonService.doGet<IResponse<any>>('rent-hostel/getNewest')
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.lstHostel = res.data;
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
