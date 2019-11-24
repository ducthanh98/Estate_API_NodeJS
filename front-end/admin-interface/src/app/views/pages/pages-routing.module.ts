import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AmentitiesComponent } from './amentities/amentities.component';
import { ReportTypeComponent } from './report-type/report-type.component';


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

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
