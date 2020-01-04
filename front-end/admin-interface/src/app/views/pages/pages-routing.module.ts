import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AmentitiesComponent } from './amentities/amentities.component';
import { ReportTypeComponent } from './report-type/report-type.component';
import { ReportComponent } from './report/report.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  {
    path: 'amentities',
    data: {
      title: 'Amentities'
    },
    component: AmentitiesComponent
  },
  {
    path: 'report-type',
    data: {
      title: 'Report Type'
    },
    component: ReportTypeComponent
  },
  {
    path: 'report',
    data: {
      title: 'Report'
    },
    component: ReportComponent
  },
  {
    path: 'user',
    data: {
      title: 'User'
    },
    component: UserComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
