import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ConfiguredUser } from '../models/configured-users.model';

@Injectable({ providedIn: 'root' })
export class ConfiguredUsersService {
  configUsers: ConfiguredUser[] = [];
  baseURL = environment.nodeEndPoint + '/auth';
  errorOccured = false;

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<object[]>(this.baseURL).pipe(
      map((userData) => {
        return userData.map((user) => {
          return new ConfiguredUser(
            (user as any).email,
            (user as any).isAdmin,
            (user as any)._id
          );
        });
      }),
      catchError((errorRes) => {
        // Send to analytics server
        return throwError(errorRes);
      })
    );
  }

  updateAdmin(serverId: string, isAdmin: boolean) {
    const patchData = { isAdmin };
    const uRL = this.baseURL + '/' + serverId;
    return this.http.patch(uRL, patchData, {
      observe: 'response',
    });
  }

  removeUser(serverId: string) {
    const uRL = this.baseURL + '/' + serverId;
    return this.http.delete(uRL);
  }
}
