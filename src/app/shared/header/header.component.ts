import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/auth/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userLoginOn: boolean = false;
  private subscription!: Subscription;
  constructor(private loginService: LoginService) {}

  logOut(): void {
    sessionStorage.removeItem('token_session');
    this.loginService.logOut();
  }

  ngOnInit(): void {
    this.subscription = this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      },
    });
    this.loginService.checkLoginStatus();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
