import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { IResponse } from '../../shared/interfaces/Iresponse.interface';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styles: [
    `
    .fa {
      font-size: 100px;
    }
    .message {
      font-size: 50px;
    }
    }
    `
  ]
})
export class VerifyComponent implements OnInit {
  isActive: boolean = null;
  private verifyCode: string;
  private id: string;
  constructor(
    private commonService: CommonService,
    private activeRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.verifyCode = this.activeRoute.snapshot.paramMap.get('verifyCode');
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    this.activeEmail();
  }
  activeEmail() {
    const url = `auth/verify/${this.id}/${this.verifyCode}`;
    this.commonService.doGet(url)
      .subscribe(
        (data: IResponse<any>) => {
          if (data.statusCode === 0) {
            this.isActive = true;
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
          } else {
            this.isActive = false;
          }
        }, (err) => {
          this.isActive = false;
        }
      );
  }

}
