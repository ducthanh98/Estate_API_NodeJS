import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonService } from './../../../shared/services/common.service';

@Component({
  selector: 'app-list-hostel',
  templateUrl: './list-hostel.component.html',
  styleUrls: ['./list-hostel.component.css']
})
export class ListHostelComponent implements OnInit, AfterViewInit {

  constructor(private commonService: CommonService) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    this.commonService.generateScript();
  }

}
