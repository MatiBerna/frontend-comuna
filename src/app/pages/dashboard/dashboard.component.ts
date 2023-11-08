import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { Person } from 'src/app/models/person';
import { LoginService } from 'src/app/services/auth/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  userLoginOn: boolean = false;
  userData?: Admin | Person;
  private loginSubs!: Subscription;
  private userDataSubs!: Subscription;
  constructor(private loginService: LoginService) {}

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

  ngOnDestroy(): void {
    this.userDataSubs.unsubscribe();
    this.loginSubs.unsubscribe();
  }
}
