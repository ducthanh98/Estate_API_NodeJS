import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonService } from './../shared/services/common.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html'
})
export class PagesComponent {
  constructor(private commonService: CommonService) { }
}
