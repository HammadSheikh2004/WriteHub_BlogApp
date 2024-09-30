import { Component, ElementRef, OnInit } from '@angular/core';
import { HeadingComponent } from '../../../ReuseableComp/heading/heading.component';
import Lottie from 'lottie-web';
import { ButtonComponent } from '../../../ReuseableComp/button/button.component';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../Shared/user.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    HeadingComponent,
    ButtonComponent,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  formDataModel!: FormGroup;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    public service: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const element = this.elementRef.nativeElement.querySelector(
      '#signImage'
    ) as HTMLElement;

    Lottie.loadAnimation({
      container: element,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/Images/signUp.json',
    });

    this.formDataModel = this.fb.group({
      UserName: ['', Validators.required],
      Email: ['', [Validators.email, Validators.required]],
      FullName: ['', Validators.required],
      Passwords: this.fb.group(
        {
          Password: ['', [Validators.required, this.PasswordStrength()]],
          ConfirmPassword: ['', Validators.required],
        },
        { validators: this.ComparePassword() }
      ),
    });
  }

  ComparePassword(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = (formGroup as FormGroup).get('Password');
      const confirmPasswordControl = (formGroup as FormGroup).get(
        'ConfirmPassword'
      );

      if (
        passwordControl &&
        confirmPasswordControl &&
        passwordControl.value !== confirmPasswordControl.value
      ) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  PasswordStrength(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
        return null;
      }

      return { PasswordStrength: true };
    };
  }

  register = () => {
    var body = {
      UserName: this.formDataModel.value.UserName,
      Email: this.formDataModel.value.Email,
      FullName: this.formDataModel.value.FullName,
      Password: this.formDataModel.value.Passwords.Password,
      ConfirmPassword: this.formDataModel.value.ConfirmPassword,
    };

    this.service.registration(body).subscribe(
      (res: any) => {
        console.log(res);
        if (res.message) {
          console.log('Email Send SuccessFully');
          this.formDataModel.reset();
          this.toastr.success('User Created!', 'Registration Successfully!');
        } else {
          res.errors.forEach((element: { code: any; description: string }) => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error(
                  'UserName is Already Taken!',
                  'Registration Cancelled!'
                );
                break;
              case 'InvalidUserName':
                this.toastr.error(
                  'UserName only contain single word!',
                  'Registration Cancelled!'
                );
                break;
              default:
                this.toastr.error(
                  element.description,
                  'Registration Cancelled!'
                );
                break;
            }
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };
}
