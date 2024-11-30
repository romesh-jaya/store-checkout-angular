import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UtilityService } from '../../services/utility.service';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ChangePasswordComponent {
  showSpinner = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private utilityService: UtilityService,
    private notificationService: NotificationService
  ) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const oldPassword = form.value.old_password;
    const password = form.value.password;

    this.showSpinner = true;

    this.authService.changePassword(oldPassword, password).subscribe(
      () => {
        this.showSpinner = false;
        this.notificationService.success(
          'Password changed successfully! Please login'
        );
        this.authService.logout();
        this.router.navigate(['/']);
      },
      (error) => {
        this.showSpinner = false;
        this.notificationService.error(this.utilityService.getError(error));
      }
    );
  }
}
