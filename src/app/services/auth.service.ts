import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CookieOptions, CookieService } from 'ngx-cookie';
import { LoginUser } from '../models/login-user.model';
import { LoggedInDataService } from './logged-in-data.service';
import { UtilityService } from './utility.service';
import { environment } from '../environments/environment';

export interface AuthResponseData {
  token: string;
  isAdmin: boolean;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  loginProcessComplete = new Subject<boolean>();
  baseURL = environment.nodeEndPoint + '/users';
  expiryTimeIntervalDays = 365;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    private lIDService: LoggedInDataService,
    private utilityService: UtilityService
  ) {}

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.baseURL + '/login', {
        email,
        password,
      })
      .pipe(
        tap((resData) => {
          this.handleAuthentication(
            email,
            resData.token,
            resData.isAdmin,
            resData.refreshToken
          );
        })
      );
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.baseURL + '/signup', {
        email,
        password,
      })
      .pipe(
        tap((resData) => {
          this.handleAuthentication(
            email,
            resData.token,
            resData.isAdmin,
            resData.refreshToken
          );
        })
      );
  }

  changePassword(oldPassword: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.baseURL + '/change-password', {
        oldPassword: oldPassword,
        password,
      })
      .pipe(
        tap((resData) => {
          if (this.lIDService.loggedInUser) {
            this.handleAuthentication(
              this.lIDService.loggedInUser.email,
              resData.token,
              resData.isAdmin,
              resData.refreshToken
            );
          }
        })
      );
  }

  refreshToken() {
    if (this.lIDService.loggedInUser) {
      let email = this.lIDService.loggedInUser.email;
      let refreshToken = this.lIDService.loggedInUser.refreshToken;

      return this.http
        .post<AuthResponseData>(this.baseURL + '/refresh-token', {
          email,
          refreshToken,
        })
        .pipe(
          tap((resData) => {
            console.info('Obtained fresh token.');
            this.handleAuthentication(
              email ?? '',
              resData.token,
              resData.isAdmin,
              refreshToken
            );
          })
        );
    }

    return null;
  }

  refreshTokenOnAutoLogin(email: string, refreshToken: string) {
    this.http
      .post<AuthResponseData>(this.baseURL + '/refresh-token', {
        email,
        refreshToken,
      })
      .toPromise()
      .then((resData) => {
        this.handleAuthentication(
          email,
          resData?.token ?? '',
          resData?.isAdmin ?? false,
          refreshToken
        );
      })
      .catch((error) => {
        console.error(
          'Autologin using refresh token failed: ' +
            this.utilityService.getError(error)
        );
      });
  }

  private handleAuthentication(
    email: string,
    token: string,
    isAdmin: boolean,
    refreshToken: string
  ) {
    const user = new LoginUser(email, token, isAdmin, refreshToken);
    this.lIDService.loggedInUser = user;
    this.lIDService.loginChanged.next(null);
    // creating a secure cookie.
    const saveData = {
      ...this.lIDService.loggedInUser,
      lastLoggedIn: new Date().getTime(),
    };
    let cookieOptions: CookieOptions = {
      // set expiry for 1 year
      expires: this.utilityService.addDays(
        new Date(),
        this.expiryTimeIntervalDays
      ),
    };
    this.cookieService.put('AuthUser', JSON.stringify(saveData), cookieOptions);
    this.loginProcessComplete.next(true);
  }

  autoLogin() {
    let timeLapsed;
    const currentDate = new Date();
    const storedCookie = this.cookieService.get('AuthUser');
    if (storedCookie) {
      const userData: {
        email: string;
        token: string;
        _isAdmin: boolean;
        refreshToken: string;
        lastLoggedIn: number;
      } = JSON.parse(storedCookie);

      if (!userData) {
        return;
      }

      timeLapsed =
        currentDate.getTime() - new Date(userData.lastLoggedIn).getTime();
      if (timeLapsed / (1000 * 60) > 60) {
        // if the last login was greater than 60 mins
        // get a fresh token - mostly to check that server connection is still up
        this.refreshTokenOnAutoLogin(userData.email, userData.refreshToken);
      } else {
        console.info('Autologin without refresh token');
        const user = new LoginUser(
          userData.email,
          userData.token,
          userData._isAdmin,
          userData.refreshToken
        );
        this.lIDService.loggedInUser = user;
        this.lIDService.loginChanged.next(null);
      }
    }
    this.loginProcessComplete.next(true);
  }

  logout() {
    this.lIDService.loggedInUser = undefined;
    this.lIDService.loginChanged.next(null);
    this.lIDService.currentScreenName.next('');
    this.router.navigate(['/']);
    this.cookieService.remove('AuthUser');
  }
}
