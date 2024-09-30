import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../../../../Shared/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgIf, RouterLink, RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnDestroy {
  constructor(private router: Router, private service: UserService) {}

  AdminDetail: any;

  ngOnInit(): void {
    history.pushState(null, '', location.href);
    window.onpopstate = this.preventBackNavigation;

    this.service.GetUserDetails().subscribe(
      (res) => {
        console.log(res);
        this.AdminDetail = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnDestroy(): void {
    window.onpopstate = null;
  }

  preventBackNavigation = () => {
    history.pushState(null, '', location.href);
  };

  logout = () => {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  };
}
