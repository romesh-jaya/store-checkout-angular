import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { LoggedInDataService } from '../../services/logged-in-data.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    MatMenuModule,
    MatMenuTrigger,
    MatButtonModule,
  ],
  providers: [],
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  isAdmin = false;
  isSuperUser = false;
  loggedInUser: any;
  constructor(
    private authService: AuthService,
    private lIDService: LoggedInDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.refreshInfo();

    this.lIDService.loginChanged.subscribe(() => {
      this.refreshInfo();
    });
  }

  refreshInfo() {
    this.isAuthenticated = !!this.lIDService.loggedInUser;
    if (this.lIDService.loggedInUser) {
      this.loggedInUser = this.lIDService.loggedInUser.email;
      this.isAdmin = this.lIDService.loggedInUser.isAdmin;
      this.isSuperUser = this.lIDService.loggedInUser.isSuperUser;
    } else {
      this.isAdmin = false;
      this.isSuperUser = false;
    }
  }

  onLogout() {
    this.authService.logout();
  }

  onChangePassword() {
    this.router.navigate(['/change-password']);
  }
}
