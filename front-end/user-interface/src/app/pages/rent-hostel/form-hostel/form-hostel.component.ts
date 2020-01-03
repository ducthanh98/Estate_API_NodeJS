import { Component, OnInit, ViewChild, ElementRef, NgZone, ɵConsole } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { CommonService } from './../../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { WebConstants } from '../../../shared/constants/constants';
import { MapsAPILoader } from '@agm/core';
/// <reference types="@types/googlemaps" />
@Component({
  selector: 'app-form-hostel',
  templateUrl: './form-hostel.component.html',
  styles: [`
    agm-map {
      height: 500px;
    }
    .search-position {
      position: absolute;
      z-index: 99;
      width: 50%;
      margin: auto;
      left: 25%;
      top: 1%;
    }
  `]
})
export class FormHostelComponent implements OnInit {
  public Editor = ClassicEditor;
  gallery = [];
  listFiles = [];
  hostelForm: FormGroup;
  files = [];
  amentitiesData = [];
  private geoCoder;
  lat = 21.028511;
  lng = 105.804817;
  zoom: number;
  @ViewChild('search', { static: true }) public searchElementRef: ElementRef;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { }

  ngOnInit() {
    this.getLstAmentities();
    this.initForm();
    this.createAutoCompleteBox();
  }

  createAutoCompleteBox() {
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set lat, lng and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
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
  }

  getLstAmentities() {
    this.commonService.doGet('admin/amentities/getAll')
      .subscribe(
        (res: any) => {
          if (res.statusCode === 0) {
            this.amentitiesData = res.data;
            this.addCheckboxes();

          } else {
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.commonService.errorHandler(err);
        }
      );
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
    return selected;
  }
  onSubmit() {
    if (this.hostelForm.invalid) {
      this.toastrService.error(WebConstants.FORM_INVALID);
      return;
    }
    const formData = this.parseValueForRequest();
    this.commonService.doPost('rent-hostel/create', formData)
      .subscribe(
        (res: any) => {
          if (res.statusCode === 0) {
            this.toastrService.success(res.message);
            setTimeout(() => {
              this.router.navigate(['pages/rent-hostel/list-hostel']);
            }, 1500);
          } else {
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.commonService.errorHandler(err);
        }
      );
  }

  parseValueForRequest(): FormData {
    const formData: FormData = new FormData();
    const uid = this.commonService.userInfo.id;
    const body = {
      ...this.hostelForm.value,
      userId: uid,
      amentities: this.getSelectedAmentities(),
      lat: this.lat,
      lng: this.lng
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
    return formData;
  }

  changeLocation(event$) {
    console.log(event$);
  }
}
