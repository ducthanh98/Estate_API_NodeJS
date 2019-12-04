import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonService } from './../../shared/services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private commonService: CommonService) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    this.commonService.generateScript();
  }
}
