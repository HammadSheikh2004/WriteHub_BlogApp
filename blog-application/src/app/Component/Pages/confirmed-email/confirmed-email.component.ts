import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../Shared/user.service';

@Component({
  selector: 'app-confirmed-email',
  standalone: true,
  templateUrl: './confirmed-email.component.html',
  styleUrls: ['./confirmed-email.component.css'],
})
export class ConfirmedEmailComponent {
  constructor(
    private service: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const UserId = this.route.snapshot.queryParamMap.get('UserId');
    const token = decodeURIComponent(this.route.snapshot.queryParamMap.get('Token') as string) ;

    if (UserId && token) {
      this.service.confirmEmail(UserId, token).subscribe(
        (response) => {
          if (response?.message) {
            console.log(response.message);
            if (response.message.includes('successfully')) {
              setTimeout(() => {
                this.router.navigate(['/signin']);
              }, 5000);
            }
          } else {
            console.log("Unexpected response", response);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
