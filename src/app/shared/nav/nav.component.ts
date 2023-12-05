import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { Person } from 'src/app/models/person';
import { LoginService } from 'src/app/services/auth/login.service';
import { getDecodedAccessToken } from 'src/app/utils/tokenValidations';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  userLoginOn: boolean = false;
  userData?: Admin | Person;
  isCollapsed: boolean = true;
  private loginSubs!: Subscription;
  private userDataSubs!: Subscription;
  constructor(public loginService: LoginService) {}

  ngOnInit(): void {
    this.loginSubs = this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      },
    });

    this.userDataSubs = this.loginService.currentUserData.subscribe({
      next: (userData) => {
        this.userData = userData;
      },
    });
  }

  isAdmin() {
    const token = sessionStorage.getItem('token_session');

    if (token) {
      const decodedToken = getDecodedAccessToken(token);
      return 'username' in decodedToken.user;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.userDataSubs.unsubscribe();
    this.loginSubs.unsubscribe();
  }
}
