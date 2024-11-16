import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoginUser } from '../models/login-user.model';

@Injectable({ providedIn: 'root' })
export class LoggedInDataService {
    loggedInUser: LoginUser | undefined;
    loginChanged = new Subject();
}
