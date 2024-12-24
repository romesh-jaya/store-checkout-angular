import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggedInDataService } from '../services/logged-in-data.service';
import { NotificationService } from '../services/notification.service';
import { noAccessMessage, pleaseLoginMessage } from '../constants/constants';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private lIDService: LoggedInDataService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const isAuth = !!this.lIDService.loggedInUser;
    if (isAuth) {
      return true;
    }

    this.notificationService.error(pleaseLoginMessage);

    return this.router.navigate(['/']);
  }
}
