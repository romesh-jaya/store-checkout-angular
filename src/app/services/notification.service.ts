import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly toastr = inject(ToastrService);

  error(message: string) {
    this.toastr.error(message);
  }
}
