import { Component } from '@angular/core';
import { LoginComponent } from './screens/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent],
  template: `<app-login></app-login>`
})
export class AppComponent {}
