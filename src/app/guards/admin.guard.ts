import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggedInDataService } from '../services/logged-in-data.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private lIDService: LoggedInDataService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.lIDService.loggedInUser;

    if (!user) {
      return this.router.navigate(['/']);
    }

    if (user.isAdmin || user.isSuperUser) {
      return true;
    }

    return this.router.navigate(['/no-access']);
  }
}
