import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { CommonService } from './../../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-form-hostel',
  templateUrl: './form-hostel.component.html',
  styleUrls: ['./form-hostel.component.css']
})
export class FormHostelComponent implements OnInit {
  public Editor = ClassicEditor;
  gallery = [];
  listFiles = [];
  hostelForm: FormGroup;
  files = [];
  amentitiesData = [];
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.getLstAmentities();
    this.initForm();

  }

  initForm() {
    this.hostelForm = this.fb.group({
      title: ['', [Validators.required]],
      location: ['', [Validators.required]],
      bedrooms: [1, [Validators.required]],
      bathrooms: [1, [Validators.required]],
      area: ['', [Validators.required]],
      price: ['', [Validators.required]],
      description: ['', [Validators.required]],
      amentities: new FormArray([])
    });
  }
  private addCheckboxes() {
    this.amentitiesData.forEach((o, i) => {
      const control = new FormControl(); // if first item set to true, else false
      (this.hostelForm.controls.amentities as FormArray).push(control);
    });
    console.log(this.hostelForm.controls.amentities as FormArray)
  }

  getLstAmentities() {
    this.commonService.doGet('admin/amentities/getAll')
      .subscribe(
        (res: any) => {
          if (res.statusCode === 0) {
            console.log(res.data);
            this.amentitiesData = res.data;
            this.addCheckboxes();

          } else {
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.commonService.errorHandler(err);
        }
      )
  }

  onChangeFile(event$) {
    const { files } = event$.target;
    this.files = files;
    if (files.length === 0) {
      this.gallery = [];
      return;
    }
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.includes('image')) {
        event$.srcElement.value = null;
        this.files = [];
        return;
      }
      if (event$.target.files[i].size / 1024 / 1024 >= 8) {
        event$.srcElement.value = null;
        this.files = [];
        return;
      }
      const fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(event$.target.files[i]);
      fileReader.onload = (base64: any) => {
        this.gallery.push(base64.target.result);
      };
    }

  }
  getSelectedAmentities() {
    const selected = this.hostelForm.value.amentities
      .map((v, i) => v ? this.amentitiesData[i].id : null)
      .filter(v => v !== null);
    console.log(selected)
    console.log(typeof (selected))
    return selected;
  }
  onSubmit() {
    if (this.hostelForm.invalid) {
      return;
    }
    const formData: FormData = new FormData();
    const uid = this.commonService.userInfo.id;
    const body = {
      ...this.hostelForm.value,
      userId: uid,
      amentities: this.getSelectedAmentities()
    };
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        formData.append(key, body[key]);
      }
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.files.length; i++) {
      formData.append('files', this.files[i]);
    }
    this.commonService.doPost('rent-hostel/create', formData)
      .subscribe(
        (res: any) => {
          if (res.statusCode === 0) {
            this.toastrService.success(res.message);
            setTimeout(() => {
              this.router.navigate(['pages/rent-hostel/list-hostel'])
            }, 1500);
          } else {
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.commonService.errorHandler(err);
        }
      )
  }
}
