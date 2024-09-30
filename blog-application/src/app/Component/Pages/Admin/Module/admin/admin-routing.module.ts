import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from '../../admin-dashboard/admin-dashboard.component';
import { authGuardGuard } from '../../../../../Shared/Auth/auth-guard.guard';
import { ProfileComponent } from '../../../profile/profile.component';

const routes: Routes = [
  {
    path: 'adminDashboard',
    title: 'Admin Panel',
    component: AdminDashboardComponent,
    canActivate: [authGuardGuard],
    children: [
      { path: 'profile', component: ProfileComponent, title: 'Profile Update' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
