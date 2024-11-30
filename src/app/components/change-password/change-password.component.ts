import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UtilityService } from '../../services/utility.service';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

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
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    let dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        message: 'Are you sure you wish to change your password?',
        title: 'Change password',
      },
      panelClass: 'custom-modalbox',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.changePassword(form);
    });
  }

  changePassword(form: NgForm) {
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
