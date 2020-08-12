import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthenticationComponent} from "./authentication/authentication.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in', // authentication
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthenticationComponent,  // this be the login page
    loadChildren: () => import('src/app/authentication/authentication.module').then(x => x.AuthenticationModule)
  },
  {
    path: '',
    component: DashboardComponent,  // this be the login page
    loadChildren: () => import('src/app/dashboard/dashboard.module').then(x => x.DashboardModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
