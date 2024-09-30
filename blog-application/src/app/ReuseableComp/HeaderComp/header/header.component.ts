import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchserviceService } from '../../../Shared/Search/searchservice.service';
import {jwtDecode} from 'jwt-decode';  // Correct import for jwt_decode
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, FormsModule,NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],  // Use 'styleUrls' not 'styleUrl'
})
export class HeaderComponent {
  token: any = null;
  isAdmin: boolean = false;
  userToken: any = null;

  constructor(private searchService: SearchserviceService) {}

  ngOnInit(): void {
    this.userToken = localStorage.getItem('token');
    if (this.userToken) {
      try {
        const decodedToken: any = jwtDecode(this.userToken);
        console.log(decodedToken);

        // Check if the user is an Admin based on the token's 'sub' property or other claims
        this.isAdmin = decodedToken.role === 'Admin';
      } catch (error) {
        console.error('Error decoding token', error);
      }
    }
  }

  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchValue = inputElement?.value || '';
    this.searchService.updateSearchQuery(searchValue);
  }
}
