import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { ErrorService } from 'src/app/services/error/error.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css'],
})
export class AddAdminComponent implements OnInit, OnDestroy {
  @Input() admin!: Admin;
  //private userDataSubs!: Subscription;
  adminError: string = '';
  private errorSub!: Subscription;
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
    private adminsService: AdminsService,
    private errorService: ErrorService
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
          this.close('Registro');
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

  close(reason: string) {
    this.adminForm.reset();
    this.modalService.dismissAll(reason);
  }

  ngOnInit(): void {
    this.adminForm.controls._id.setValue(this.admin._id!);

    if (this.admin._id !== null) {
      this.adminForm.controls.username.setValue(this.admin.username!);
    } else {
      this.adminForm.controls.password.addValidators(Validators.required);
    }

    this.errorSub = this.errorService.errors.subscribe((errors) => {
      for (const error of errors) {
        switch (error.path) {
          case 'username':
            this.username.setErrors({ serverError: error.msg });
            break;
          case 'password':
            this.password.setErrors({ serverError: error.msg });
            break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
