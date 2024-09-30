import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../../../../Shared/user.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule, RouterOutlet],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  constructor(private router: Router, private service: UserService) {}

  data: any;

  ngOnInit(): void {
    

    
    

    this.service.GetUserDetails().subscribe(
      (res) => {
        console.log(res);
        this.data = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
