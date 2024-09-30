import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './ReuseableComp/HeaderComp/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrConfigModule } from './Shared/toastr-config.module';
import { NgxEditorModule } from 'ngx-editor';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterOutlet,
    HeaderComponent,
    ToastrConfigModule,
    FormsModule,
    NgxEditorModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'blog-application';
  showHeader = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.router.routerState.root.firstChild?.data.subscribe(data => {
          this.showHeader = data['showHeader'] !== false;
        });
      }
    });
  }

  
  
}
