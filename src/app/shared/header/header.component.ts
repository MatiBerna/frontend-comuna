import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AddAdminComponent } from 'src/app/components/admins/add-admin/add-admin.component';
import { AddPersonComponent } from 'src/app/components/persons/add-person/add-person.component';
import { adminGuard } from 'src/app/guards/admin.guard';
import { loginGuard } from 'src/app/guards/login.guard';
import { Admin } from 'src/app/models/admin';
import { Person } from 'src/app/models/person';
import { LoginService } from 'src/app/services/auth/login.service';
import { ToastService } from 'src/app/services/shared/toast/toast.service';
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
    private modalService: NgbModal,
    private toastService: ToastService,
    private router: Router
  ) {}

  logOut(): void {
    this.loginService.logOut();
  }

  openModifyUser() {
    this.loginService.checkLoginStatus();
    if (this.userLoginOn) {
      if (this.checkUserRole() === 'Admin') {
        const modalRef = this.modalService.open(AddAdminComponent, {
          backdrop: true,
        });
        modalRef.componentInstance.admin = this.userData;

        modalRef.dismissed.subscribe((reason: string) => {
          if (reason === 'Registro') {
            this.toastService.show('Cambios registrados', {
              classname: 'bg-success text-light',
              delay: 5000,
            });
          }
        });
      } else {
        const modalref = this.modalService.open(AddPersonComponent);
        modalref.componentInstance.person = this.userData;
        modalref.dismissed.subscribe((reason: string) => {
          if (reason === 'Registro') {
            this.toastService.show('Cambios registrados', {
              classname: 'bg-success text-light',
              delay: 5000,
            });
          }
        });
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  checkUserRole() {
    if ('username' in this.userData!) {
      return 'Admin';
    } else {
      return 'Person';
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
