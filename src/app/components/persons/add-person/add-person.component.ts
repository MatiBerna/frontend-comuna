import { Component, Input, OnInit } from '@angular/core';
import { Person } from 'src/app/models/person';
import {
  NgbDate,
  NgbModal,
  NgbDateStruct,
  NgbCalendar,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css'],
})
export class AddPersonComponent implements OnInit {
  @Input() person!: Person;
  modalRef!: NgbModalRef;
  today = new Date();
  maxDate!: NgbDateStruct;

  personForm = this.formBuilder.group({
    _id: [''],
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
      [Validators.required, Validators.pattern('^[a-zA-ZñÑá-úÁ-Ú]*$')],
    ],
    lastName: [
      '',
      [Validators.required, Validators.pattern('^[a-zA-ZñÑá-úÁ-Ú]*$')],
    ],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern('^[0-9]+$')]],
    birthdate: [
      {
        year: this.today.getFullYear(),
        month: this.today.getMonth() + 1,
        day: this.today.getDate(),
      },
      [Validators.required],
    ],
  });

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  // open(content: any) {
  //   // this.person = person;
  //   // console.log(content);
  //   this.modalService.open(content, {
  //     ariaLabelledBy: 'editPersonModal',
  //   });
  //   console.log(this.person);
  // }

  close() {
    this.personForm.reset();
    this.modalService.dismissAll();
  }

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

  ngOnInit(): void {
    this.maxDate = {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate(),
    };

    let birthdateJS: Date = new Date(this.person.birthdate);
    let birthdateNgb: NgbDateStruct = {
      year: birthdateJS.getFullYear(),
      month: birthdateJS.getMonth() + 1,
      day: birthdateJS.getDate(),
    };

    this.personForm.controls.dni.setValue(this.person.dni);
    this.personForm.controls.firstName.setValue(this.person.firstName);
    this.personForm.controls.lastName.setValue(this.person.lastName);
    this.personForm.controls.email.setValue(this.person.email);
    this.personForm.controls.phone.setValue(this.person.phone);
    this.personForm.controls.birthdate.setValue(birthdateNgb);
    //this.personForm.controls.dni.setValue(this.person.dni);
    console.log(this.person);
  }
}
