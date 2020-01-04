import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonService } from './../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from './../../shared/interfaces/Iresponse.interface';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit {
  email = '';
  constructor(
    private commonService: CommonService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    this.commonService.generateScript();
  }

  subcribeEmail() {
    this.commonService.doPost('observe/register', { email: this.email })
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.toastrService.success(res.message);
          } else {
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.message);
        }
      );
  }


}
