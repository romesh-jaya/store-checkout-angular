import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from '../../services/auth.service';
import { LoggedInDataService } from '../../services/logged-in-data.service';
import { UtilityService } from '../../services/utility.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [],
})
export class LandingPageComponent implements OnInit {
  isLoginMode = true;
  isLoggedIn = false;
  showSpinner = false;
  requiredCharCountForPassword = 6;

  constructor(
    private authService: AuthService,
    private lIDService: LoggedInDataService,
    private utilityService: UtilityService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.isLoggedIn = !!this.lIDService.loggedInUser;
    this.lIDService.loginChanged.subscribe(() => {
      this.isLoggedIn = !!this.lIDService.loggedInUser;
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.showSpinner = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    // perform login
    authObs.subscribe(
      () => {
        this.showSpinner = false;
        this.isLoggedIn = true;
        form.reset();

        this.isLoginMode = true; // for next time around
      },
      (error) => {
        this.showSpinner = false;
        this.notificationService.error(this.utilityService.getError(error));
      }
    );
  }
}
