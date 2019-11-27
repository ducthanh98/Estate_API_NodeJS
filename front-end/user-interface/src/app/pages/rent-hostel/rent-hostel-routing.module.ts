import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListHostelComponent } from './list-hostel/list-hostel.component';
import { FormHostelComponent } from './form-hostel/form-hostel.component';


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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentHostelRoutingModule { }
