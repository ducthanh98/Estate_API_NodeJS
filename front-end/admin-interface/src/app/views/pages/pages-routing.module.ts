import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AmentitiesComponent } from './amentities/amentities.component';


const routes: Routes = [
  {
    path: 'amentities',
    data: {
      title: 'Amentities'
    },
    component: AmentitiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
