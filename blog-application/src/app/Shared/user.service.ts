import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  private registerApi = 'http://localhost:5241/api/Authentication/Register';
  private ConfirmEmailApi =
    'http://localhost:5241/api/Authentication/ConfirmEmail';
  private SignInApi = 'http://localhost:5241/api/Authentication/Signin';
  private UserDetails =
    'http://localhost:5241/api/Authentication/GetUserDetails';

  private ProfileUpdate =
    'http://localhost:5241/api/Authentication/UpdateProfile';

  registration = (data: any): Observable<any> => {
    return this.httpClient.post<any>(this.registerApi, data);
  };

  confirmEmail = (userId: string, token: string): Observable<any> => {
    return this.httpClient.post<any>(this.ConfirmEmailApi, { userId, token });
  };

  signin = (signinData: any): Observable<any> => {
    return this.httpClient.post<any>(this.SignInApi, signinData);
  };

  GetUserDetails = (): Observable<any> => {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });
    return this.httpClient.get<any>(this.UserDetails, { headers });
  };

  profileUpdate(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      enctype: 'multipart/form-data',
    });
    return this.httpClient.post<any>(this.ProfileUpdate, formData, { headers });
  }
}
