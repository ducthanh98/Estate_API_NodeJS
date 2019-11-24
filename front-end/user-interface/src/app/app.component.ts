import { Component, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommonService } from './shared/services/common.service';

@Component({
  selector: 'app-root',
  template: `
  <router-outlet></router-outlet>
  `
})
export class AppComponent {

}
