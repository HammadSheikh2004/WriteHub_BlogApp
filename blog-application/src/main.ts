import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ToastrConfigModule } from './app/Shared/toastr-config.module';
ToastrConfigModule

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
