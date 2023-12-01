import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AddAdminComponent } from 'src/app/components/admins/add-admin/add-admin.component';
import { adminGuard } from 'src/app/guards/admin.guard';
import { loginGuard } from 'src/app/guards/login.guard';
import { Admin } from 'src/app/models/admin';
import { Person } from 'src/app/models/person';
import { LoginService } from 'src/app/services/auth/login.service';
import { expirationTokenAuth } from 'src/app/utils/tokenValidations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userLoginOn: boolean = false;
  userData?: Admin | Person;
  private loginSubs!: Subscription;
  private userDataSubs!: Subscription;
  constructor(
    private loginService: LoginService,
    private modalService: NgbModal
  ) {}

  logOut(): void {
    sessionStorage.removeItem('token_session');
    this.loginService.logOut();
  }

  openModifyUser() {
    if (!expirationTokenAuth(sessionStorage.getItem('token_session')!)) {
      if (adminGuard()) {
        this.modalService.open(AddAdminComponent, { backdrop: true });
      } else {
        window.alert('NO ESTA HECHO MI REY');
      }
    }
  }

  ngOnInit(): void {
    this.loginSubs = this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      },
    });
    this.loginService.checkLoginStatus();

    this.userDataSubs = this.loginService.currentUserData.subscribe({
      next: (userData) => {
        this.userData = userData;
      },
    });
  }

  ngOnDestroy(): void {
    this.loginSubs.unsubscribe();
    this.userDataSubs.unsubscribe();
  }
}
