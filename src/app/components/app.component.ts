import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private authService: AuthService) {}
  title = 'store-checkout-angular';
  loginProcessComplete = false;

  ngOnInit() {
    this.authService.loginProcessComplete.subscribe((data) => {
      this.loginProcessComplete = data;
    });
    this.authService.autoLogin();
  }
}
