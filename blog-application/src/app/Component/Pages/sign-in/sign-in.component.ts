import { Component, ElementRef, OnInit } from '@angular/core';
import { HeadingComponent } from '../../../ReuseableComp/heading/heading.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import lottie from 'lottie-web';
import { ButtonComponent } from '../../../ReuseableComp/button/button.component';
import { UserService } from '../../../Shared/user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    HeadingComponent,
    RouterLink,
    RouterModule,
    ButtonComponent,
    FormsModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent implements OnInit {
  signinData = {
    Email: '',
    Password: '',
  };
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private service: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const element = this.elementRef.nativeElement.querySelector(
      '#signImage'
    ) as HTMLElement;

    lottie.loadAnimation({
      container: element,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/Images/signIn.json',
    });

    if (localStorage.getItem('token') != null) {
      this.router.navigate(['/admin/adminDashboard']);
    }

    if (localStorage.getItem('token') != null) {
      this.router.navigate(['/user/userDashboard']);
    }
  }

  btnSubmit = (form: NgForm) => {
    if (form.valid) {
      this.submitData(form);
    } else {
      console.log('Error in Submit Data!');
    }
  };


  submitData = (form: NgForm) => {
    this.service.signin(form.value).subscribe(
      (res) => {
        console.log(res);
        if (res.message === 'Admin') {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/admin/adminDashboard']);
        } else if (res.message === 'User') {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/user/userDashboard']);
        } else {
          alert('Invalid Role!');
        }
      },
      (err) => {
        console.log(err);

        switch (true) {
          case !!err.error?.message:
            alert(err.error.message);
            break;
          case !!err.error?.userRoleError:
            alert(err.error.userRoleError);
            break;
          default:
            alert('An unexpected error occurred. Please try again later.');
            break;
        }
      }
    );
  };
}
