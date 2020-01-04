import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'rent-hostel', loadChildren: () => import('./rent-hostel/rent-hostel.module').then(m => m.RentHostelModule) },
            { path: 'contact', component: ContactComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
export const pageRoutingComponent = [
    HomeComponent
];
