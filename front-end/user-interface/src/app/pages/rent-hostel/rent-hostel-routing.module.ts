import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListHostelComponent } from './list-hostel/list-hostel.component';
import { FormHostelComponent } from './form-hostel/form-hostel.component';
import { HostelDetailComponent } from './hostel-detail/hostel-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-hostel'
  },
  {
    path: 'list-hostel',
    component: ListHostelComponent
  },
  {
    path: 'form-hostel',
    component: FormHostelComponent
  },
  {
    path: 'hostel-detail/:id',
    component: HostelDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentHostelRoutingModule { }
