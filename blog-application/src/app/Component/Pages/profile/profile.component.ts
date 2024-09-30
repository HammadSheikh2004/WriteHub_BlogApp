import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Shared/user.service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HeadingComponent } from '../../../ReuseableComp/heading/heading.component';
import { ButtonComponent } from '../../../ReuseableComp/button/button.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgIf, HeadingComponent, ButtonComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(private service: UserService) {}

  role: string = '';
  profile = {
    UserName: '',
    FullName: '',
    Email: '',
  };

  

  ngOnInit(): void {
    this.getRoleFromToken();

    this.service.GetUserDetails().subscribe(
      (data) => {
        this.profile.UserName = data.userName;
        this.profile.FullName = data.fullName;
        this.profile.Email = data.email;
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getRoleFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.role = decodedToken.role;
        console.log('Decoded role:', this.role);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.warn('No token found in localStorage');
    }
  }

  onSubmit() {
    const formData = new FormData();

    formData.append('UserName', this.profile.UserName);
    formData.append('FullName', this.profile.FullName);
    formData.append('Email', this.profile.Email);
    const imageId = document.getElementById('imageId') as HTMLInputElement;

    if (imageId.files && imageId.files.length > 0) {
      formData.append('image', imageId.files[0]);
    }

    this.service.profileUpdate(formData).subscribe(
      (res) => {
        console.log('Profile updated successfully:', res);
      },
      (err) => {
        console.error('Error updating profile:', err);
      }
    );
  }
  
}
