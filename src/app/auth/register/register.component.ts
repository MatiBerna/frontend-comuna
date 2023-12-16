import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Person } from 'src/app/models/person';
import { LoginService } from 'src/app/services/auth/login.service';
import { LoginRequest } from 'src/app/services/auth/loginRequest';
import { PersonsService } from 'src/app/services/persons/persons.service';
import { ToastService } from 'src/app/services/shared/toast/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  today: Date = new Date();
  maxDate!: NgbDateStruct | null;
  minDate!: NgbDateStruct | null;
  registerError: string = '';

  registerForm = this.formBuilder.group(
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators: this.checkPasswords }
  );

  constructor(
    private formBuilder: FormBuilder,
    private personService: PersonsService,
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastService
  ) {}

  register() {
    if (this.registerForm.valid) {
      let jsDate = new Date(
        this.birthdate.value!.year,
        this.birthdate.value!.month - 1,
        this.birthdate.value!.day
      );

      const personToSend: Person = {
        _id: null,
        dni: this.dni.value!,
        firstName: this.firstName.value!,
        lastName: this.lastName.value!,
        phone: this.phone.value,
        email: this.email.value!,
        birthdate: jsDate,
        password: this.password.value!,
      };
      this.personService.addOrUpdate(personToSend).subscribe({
        error: (err) => {
          console.log(err);
          this.registerError = err;
        },
        complete: () => {
          console.log('Usuario registrado');
          const loginReq: LoginRequest = {
            username: this.email.value!,
            password: this.password.value!,
          };
          this.loginService.login(loginReq).subscribe({
            next: (userData) => {
              sessionStorage.setItem('token_session', userData.tokenSession);
            },
            error: (errorData) => {
              console.log(errorData);
              this.registerError = errorData;
            },
            complete: () => {
              console.log('Login completo');
              this.registerForm.reset();
              this.toastService.show('Usuario registrado', {
                classname: 'bg-success text-light',
                delay: 5000,
              });
              this.router.navigateByUrl('home');
            },
          });
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  checkPasswords(group: AbstractControl) {
    let pass = group.get('password')!.value;
    let confirmPass = group.get('confirmPassword')!.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  get dni() {
    return this.registerForm.controls.dni;
  }

  get firstName() {
    return this.registerForm.controls.firstName;
  }

  get lastName() {
    return this.registerForm.controls.lastName;
  }

  get email() {
    return this.registerForm.controls.email;
  }

  get phone() {
    return this.registerForm.controls.phone;
  }

  get birthdate() {
    return this.registerForm.controls.birthdate;
  }

  get password() {
    return this.registerForm.controls.password;
  }

  get confirmPassword() {
    return this.registerForm.controls.confirmPassword;
  }

  ngOnInit(): void {
    this.minDate = { year: 1900, month: 1, day: 1 };
    this.maxDate = {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate(),
    };
  }
}
