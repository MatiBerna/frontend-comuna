import { Component, OnInit, ViewChild } from '@angular/core';
import { AddPersonComponent } from 'src/app/components/persons/add-person/add-person.component';
import { Person } from 'src/app/models/person';
import { PersonsService } from 'src/app/services/persons/persons.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-persons-list',
  templateUrl: './persons-list.component.html',
  styleUrls: ['./persons-list.component.css'],
})
export class PersonsListComponent implements OnInit {
  @ViewChild('editPersonModal')
  editPerson!: AddPersonComponent;
  personsList: Person[] = [];
  errorMessage: string = '';
  voidPerson: Person = {
    _id: null,
    dni: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthdate: new Date(),
  };
  selectedPerson: Person = {
    _id: null,
    dni: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthdate: new Date(),
  };

  constructor(
    private personsService: PersonsService,
    private modalService: NgbModal
  ) {}

  getPersons() {
    this.personsService.getAll().subscribe({
      next: (persons: Person[]) => {
        this.personsList = persons;
      },
      error: (errorData) => {
        console.log(errorData);
        this.errorMessage = errorData;
      },
    });
  }

  changeSelectedPerson(person: Person) {
    this.selectedPerson = person;
    console.log(this.selectedPerson);
  }

  openModal(person: Person) {
    this.selectedPerson = person;
    console.log(this.selectedPerson);
    const modalRef = this.modalService.open(AddPersonComponent, {
      backdrop: true,
    });
    modalRef.componentInstance.person = this.selectedPerson;
  }

  ngOnInit(): void {
    this.getPersons();
  }
}
