import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { AdminsService } from 'src/app/services/admins/admins.service';
import { LoginService } from 'src/app/services/auth/login.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css'],
})
export class AddAdminComponent implements OnInit, OnDestroy {
  userData!: Admin;
  private userDataSubs!: Subscription;
  adminError: string = '';
  adminForm = this.formBuilder.group(
    {
      _id: [''],
      username: ['', [Validators.required]],
      password: [''],
      confirmPassword: [''],
    },
    { validators: this.checkPasswords }
  );

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private adminsService: AdminsService
  ) {}

  checkPasswords(group: AbstractControl) {
    let pass = group.get('password')!.value;
    let confirmPass = group.get('confirmPassword')!.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  addOrUpdate() {
    if (this.adminForm.valid) {
      const adminToSend: Admin = {};
      if (this.adminForm.controls._id.value !== '') {
        adminToSend._id = this.adminForm.controls._id.value;
      }
      if (this.username.value !== '') {
        adminToSend.username = this.username.value;
      }
      if (this.password.value !== '') {
        adminToSend.password = this.password.value;
      }

      this.adminsService.addOrEdit(adminToSend).subscribe({
        error: (err) => {
          console.log(err);
          this.adminError = err;
        },
        complete: () => {
          console.log('Cambios Registrados');
          window.alert('Se cerrará la sesion luego de aplicados los cambios');
          sessionStorage.removeItem('token_session');
          //this.loginService.checkLoginStatus();
          location.reload(); //probablemente haya una mejor práctica
          this.close();
        },
      });
    } else {
      this.adminForm.markAllAsTouched();
    }
  }

  get username() {
    return this.adminForm.controls.username;
  }

  get password() {
    return this.adminForm.controls.password;
  }

  get confirmPassword() {
    return this.adminForm.controls.confirmPassword;
  }

  close() {
    this.adminForm.reset();
    this.modalService.dismissAll();
  }

  ngOnInit(): void {
    this.userDataSubs = this.loginService.currentUserData.subscribe({
      next: (userData) => {
        this.userData = userData as Admin;
      },
    });
    this.adminForm.controls._id.setValue(this.userData._id!);
    this.adminForm.controls.username.setValue(this.userData.username!);
  }

  ngOnDestroy(): void {
    this.userDataSubs.unsubscribe();
  }
}
