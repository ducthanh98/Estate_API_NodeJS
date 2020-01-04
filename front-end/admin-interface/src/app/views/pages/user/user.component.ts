import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { WebConstants } from '../../../shared/constants/constants';
import { IBody } from '../../../shared/interfaces/body.interface';
import { IResponse } from '../../../shared/interfaces/Iresponse.interface';
import { Amentities } from '../amentities/amentities.model';
import { CommonService } from '../../../shared/common/common.service';
import { ToastrService } from 'ngx-toastr';

enum Active {
  active = 1,
  banned = 2,
}
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {
  @ViewChild('userModal') public userModal: ModalDirective;
  @ViewChild(ConfirmDialogComponent) confirmModal: ConfirmDialogComponent;
  userForm: FormGroup;
  pageNumber = 1;
  totalPages = 1;
  pageSize = WebConstants.PAGE_SIZE;
  userData = [];
  id = null;
  baseUrl = '';
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private toastrService: ToastrService) { }

  ngOnInit() {
    this.initForm();
    this.getListUser();
  }
  ngAfterViewInit() {
    this.userModal.onHidden.subscribe(
      () => { this.userForm.reset(); }
    );
  }
  initForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      password: [''],
      re_password: [''],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      role: ['3', Validators.required],
      active: ['1'],
    },
      {
        validators: this.comparePassword
      });

  }
  comparePassword(c: AbstractControl) {
    const v = c.value;
    return (v.password === v.re_password) ? null : {
      passwordnotmatch: true
    };
  }
  getListUser(pageNumber = this.pageNumber) {
    this.pageNumber = pageNumber;
    const body: IBody = {
      pageSize: 10,
      pageNumber: pageNumber,
      keyText: ''
    };
    this.commonService.doPost<IResponse<Amentities>>('auth/getAllBy', body)
      .subscribe(
        (res: IResponse<Amentities>) => {
          if (res.statusCode === 0) {
            this.userData = res.data.list;
            this.totalPages = Math.ceil(res.data.total / 10);
          } else {
            this.userData = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        }
      );
  }
  openModal(id: number) {
    this.userModal.show();
    this.id = id;

    if (id) {
      const data = this.userData.filter(x => x.id === id)[0];
      this.userForm.patchValue({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        active: data.active === 1 ? true : false,
      });
    }
  }
  openConfirm(id: number) {
    this.confirmModal.openModal();
    this.id = id;
  }

  onSubmit() {
    let url = '';
    let body: any = {};
    if (!this.id) {
      if (!this.userForm.value.password || !this.userForm.value.re_password) {
        this.toastrService.error('Please fill all the field');
        return;
      } else if (this.userForm.errors && this.userForm.errors.passwordnotmatch) {
        this.toastrService.error('Re-password not match');
        return;
      } else if (this.userForm.invalid) {
        this.toastrService.error('Please fill all the field');
        return;
      }
      url = `auth/create`;

      body = { ...this.userForm.value };
    } else {
      if (this.userForm.errors && this.userForm.errors.passwordnotmatch) {
        this.toastrService.error('Re-password not match');
        return;
      } else if (this.userForm.invalid) {
        this.toastrService.error('Please fill all the field');
        return;
      }
      url = `auth/update/${this.id}`;

      body = { ...this.userForm.value };
      if (!body.password || !body.re_password) {
        delete body.password;
        delete body.re_password;
      } else {
        delete body.re_password;
      }
    }
    body.active = body.active ? Active.active : Active.banned;
    this.commonService.doPost(url, body)
      .subscribe(
        (data: IResponse<any>) => {
          if (data.statusCode === 0) {
            this.toastrService.success(data.message);
            this.userModal.hide();
            this.getListUser();
          } else {
            this.toastrService.error(data.message);
          }
        },
        (err: any) => {
          this.errorHandler(err);
        }
      );
  }
  errorHandler(err) {
    if (err.errors) {
      this.toastrService.error(err.errors.message);
    } else if (err.error) {
      this.toastrService.error(err.error.message);
    } else if (err.status === 0) {
      this.toastrService.error(WebConstants.SERVER_MAINTAIN);
    } else {
      this.toastrService.error(err.message);
    }
  }
}
