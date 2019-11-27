import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.hostelForm = this.fb.group({

    })
  }

  onChangeFile(event$) {
    const { files } = event$.target;
    if (files.length === 0) {
      this.gallery = [];
      return;
    }
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.includes('image')) {
        event$.srcElement.value = null;
        return;
      }
      if (event$.target.files[i].size / 1024 / 1024 >= 8) {
        event$.srcElement.value = null;
        return;
      }
      const fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(event$.target.files[i]);
      fileReader.onload = (base64: any) => {
        this.gallery.push(base64.target.result);
      };
    }

  }
}