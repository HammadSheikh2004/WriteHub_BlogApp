import { Routes } from '@angular/router';
import { IndexComponent } from './Component/Pages/index/index.component';
import { RegistrationComponent } from './Component/Pages/registration/registration.component';
import { SignInComponent } from './Component/Pages/sign-in/sign-in.component';
import { ConfirmedEmailComponent } from './Component/Pages/confirmed-email/confirmed-email.component';
import { AdminDashboardComponent } from './Component/Pages/Admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './Component/Pages/User/user-dashboard/user-dashboard.component';
import { authGuardGuard } from './Shared/Auth/auth-guard.guard';
import { ProfileComponent } from './Component/Pages/profile/profile.component';
import { BlogDetailComponent } from './Component/Pages/blog-detail/blog-detail.component';

export const routes: Routes = [
  { path: '', title: 'Home', component: IndexComponent },
  {
    path: 'registration',
    title: 'Registration',
    component: RegistrationComponent,
    data: { showHeader: false },
  },
  {
    path: 'confirmEmail',
    title: 'Confirm Email',
    component: ConfirmedEmailComponent,
    data: { showHeader: false },
  },
  {
    path: 'signin',
    title: 'Sign in',
    component: SignInComponent,
    data: { showHeader: false },
  },
  {
    path: 'blogDetail',
    title: 'Blogs Details',
    component: BlogDetailComponent,
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('../app/Component/Pages/Admin/Module/admin/admin.module').then(
        (m) => m.AdminModule
      ),
    data: { showHeader: false },
  },

  {
    path: 'user',
    loadChildren: () =>
      import('../app/Component/Pages/User/Module/user/user.module').then(
        (x) => x.UserModule
      ),
    data: { showHeader: false },
  },
];
