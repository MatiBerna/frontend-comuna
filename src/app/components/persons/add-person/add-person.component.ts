import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Person } from 'src/app/models/person';
import {
  NgbDate,
  NgbModal,
  NgbDateStruct,
  NgbCalendar,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { PersonsService } from 'src/app/services/persons/persons.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css'],
})
export class AddPersonComponent implements OnInit, OnDestroy {
  @Input() person!: Person;
  modalRef!: NgbModalRef;
  private errorSub!: Subscription;
  today: Date = new Date();
  maxDate!: NgbDateStruct | null;
  minDate!: NgbDateStruct | null;
  personError: string = '';

  personForm = this.formBuilder.group(
    {
      dni: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(7),
        ],
      ],
      firstName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-ZñÑá-úÁ-Ú ]*$')],
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-ZñÑá-úÁ-Ú ]*$')],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9]+$')]],
      birthdate: [this.maxDate, [Validators.required]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['', [Validators.minLength(6)]],
    },
    { validators: this.checkPasswords }
  );

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private personService: PersonsService,
    private errorService: ErrorService
  ) {}

  close(reason: string) {
    this.personForm.reset();
    this.modalService.dismissAll(reason);
  }

  //#region geters
  get dni() {
    return this.personForm.controls.dni;
  }

  get firstName() {
    return this.personForm.controls.firstName;
  }

  get lastName() {
    return this.personForm.controls.lastName;
  }

  get email() {
    return this.personForm.controls.email;
  }

  get phone() {
    return this.personForm.controls.phone;
  }

  get birthdate() {
    return this.personForm.controls.birthdate;
  }

  get password() {
    return this.personForm.controls.password;
  }

  get confirmPassword() {
    return this.personForm.controls.confirmPassword;
  }
  //#endregion

  checkPasswords(group: AbstractControl) {
    let pass = group.get('password')!.value;
    let confirmPass = group.get('confirmPassword')!.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  addOrUpdate() {
    if (this.personForm.valid) {
      let jsDate = new Date(
        this.birthdate.value!.year,
        this.birthdate.value!.month - 1,
        this.birthdate.value!.day
      );

      const personToSend: Person = {
        _id: this.person._id,
        dni: this.dni.value!,
        firstName: this.firstName.value!,
        lastName: this.lastName.value!,
        phone: this.phone.value,
        email: this.email.value!,
        birthdate: jsDate,
      };
      if (this.password.value !== '' && this.password.value !== null) {
        personToSend.password = this.password.value;
      }
      this.personService.addOrUpdate(personToSend).subscribe({
        error: (err) => {
          console.log(err);
          this.personError = err;
        },
        complete: () => {
          console.log('Cambios registrados');
          this.close('Registro');
        },
      });
    } else {
      this.personForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    this.minDate = { year: 1900, month: 1, day: 1 };
    this.maxDate = {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate(),
    };

    let birthdateJS: Date = new Date(this.person.birthdate!);
    let birthdateNgb: NgbDateStruct | null = null;
    if (this.person.birthdate) {
      birthdateNgb = {
        year: birthdateJS.getFullYear(),
        month: birthdateJS.getMonth() + 1,
        day: birthdateJS.getDate(),
      };
    }

    this.personForm.controls.dni.setValue(this.person.dni);
    this.personForm.controls.firstName.setValue(this.person.firstName);
    this.personForm.controls.lastName.setValue(this.person.lastName);
    this.personForm.controls.email.setValue(this.person.email);
    this.personForm.controls.phone.setValue(this.person.phone);
    this.personForm.controls.birthdate.setValue(birthdateNgb);
    if (this.person._id === null) {
      this.personForm.controls.password.addValidators(Validators.required);
    }

    this.errorSub = this.errorService.errors.subscribe((errors) => {
      errors.forEach((error: any) => {
        switch (error.path) {
          case 'dni':
            this.dni.setErrors({ serverError: error.msg });
            break;
          case 'firstName':
            this.firstName.setErrors({ serverError: error.msg });
            break;
          case 'lastName':
            this.lastName.setErrors({ serverError: error.msg });
            break;
          case 'email':
            this.email.setErrors({ serverError: error.msg });
            break;
          case 'phone':
            this.phone.setErrors({ serverError: error.msg });
            break;
          case 'birthdate':
            this.birthdate.setErrors({ serverError: error.msg });
            break;
          case 'password':
            this.password.setErrors({ serverError: error.msg });
            break;
        }
      });
    });
  }
  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
