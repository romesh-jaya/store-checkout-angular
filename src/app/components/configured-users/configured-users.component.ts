import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfiguredUser } from '../../models/configured-users.model';
import { ConfiguredUsersService } from '../../services/configured-users.service';
import { UtilityService } from '../../services/utility.service';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoggedInDataService } from '../../services/logged-in-data.service';
import { firstValueFrom } from 'rxjs';

export interface UserData {
  email: string;
  isAdmin: boolean;
  oldIsAdminValue: boolean;
  serverId: string;
}

@Component({
  selector: 'app-configured-users',
  templateUrl: './configured-users.component.html',
  styleUrls: ['./configured-users.component.scss'],
  imports: [MatCardModule, FormsModule, CommonModule, MatCheckboxModule],
  standalone: true,
})
export class ConfiguredUsersComponent implements OnInit {
  showSpinner = false;
  dataSource: UserData[] = [];

  constructor(
    private cUService: ConfiguredUsersService,
    public dialog: MatDialog,
    private utilityService: UtilityService,
    private notificationService: NotificationService,
    private lIDService: LoggedInDataService
  ) {}

  ngOnInit() {
    this.lIDService.currentScreenName.next('Manage Products');
    this.refreshUsers();
  }

  refreshUsers() {
    this.showSpinner = true;

    this.cUService.getUsers().subscribe(
      (usersFetched) => {
        this.showSpinner = false;

        this.dataSource = usersFetched.map((user) => ({
          email: user.email,
          isAdmin: user.isAdmin,
          oldIsAdminValue: user.isAdmin,
          serverId: user.serverId || '',
        }));
      },
      (error) => {
        this.showSpinner = false;
        this.notificationService.error(this.utilityService.getError(error));
      }
    );
  }

  async onSaveChanges() {
    try {
      this.showSpinner = true;

      this.dataSource.forEach(async (element) => {
        if (element.isAdmin !== element.oldIsAdminValue) {
          await firstValueFrom(
            this.cUService.updateAdmin(element.serverId, element.isAdmin)
          );
        }
      });
      this.notificationService.success('Successfully saved changes');
      this.refreshUsers();
    } catch (ex) {
      this.notificationService.error(this.utilityService.getError(ex));
    } finally {
      this.showSpinner = false;
    }
  }

  onDeleteClicked(email: string, serverId: string) {
    this.showSpinner = true;
    this.cUService.removeUser(serverId).subscribe(
      () => {
        this.notificationService.success('Deleted User ' + email);
        this.showSpinner = false;
        this.refreshUsers();
      },
      (error) => {
        this.showSpinner = false;
        this.notificationService.error(this.utilityService.getError(error));
        return;
      }
    );
  }
}
