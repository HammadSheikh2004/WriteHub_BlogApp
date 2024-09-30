import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from '../../user-dashboard/user-dashboard.component';
import { authGuardGuard } from '../../../../../Shared/Auth/auth-guard.guard';
import { ProfileComponent } from '../../../profile/profile.component';
import { CreateBlogComponent } from '../../create-blog/create-blog.component';
import { DisplayBlogComponent } from '../../display-blog/display-blog.component';
import { EditBlogComponent } from '../../edit-blog/edit-blog.component';

const routes: Routes = [
  {
    path: 'userDashboard',
    component: UserDashboardComponent,
    canActivate: [authGuardGuard],
    children: [
      { path: 'createBlog', title:'Create Blog' ,component: CreateBlogComponent },
      { path: 'displayBlogs', title:'Display Blog' , component: DisplayBlogComponent },
      { path: 'profile', title:'Update Profile' , component: ProfileComponent },
      { path: 'editBlog/:blogId', component: EditBlogComponent },
      { path: '', redirectTo: 'userDashboard', pathMatch: 'full' },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
