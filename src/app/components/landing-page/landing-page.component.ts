import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from '../../services/auth.service';
import { LoggedInDataService } from '../../services/logged-in-data.service';
import { UtilityService } from '../../services/utility.service';
import { ErrorDialog } from '../error-dialog/error-dialog';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [AuthService, LoggedInDataService],
})
export class LandingPageComponent implements OnInit {
  isLoginMode = true;
  isLoggedIn = false;
  showSpinner = false;
  requiredCharCountForPassword = 6;
  readonly dialog = inject(MatDialog);

  constructor(
    private authService: AuthService,
    private lIDService: LoggedInDataService,
    private utilityService: UtilityService
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
        if (this.isLoginMode) {
          console.log('Logged in. User: ' + email);
        } else {
          console.log('Logged in after Signup. User: ' + email);
        }

        this.showSpinner = false;
        this.isLoggedIn = true;
        form.reset();

        this.isLoginMode = true; // for next time around
      },
      (error) => {
        this.showSpinner = false;
        this.dialog.open(ErrorDialog, {
          data: { message: this.utilityService.getError(error) },
          panelClass: 'custom-modalbox',
        });
      }
    );
  }
}
