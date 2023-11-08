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
  terminoBusqueda: string = '';
  voidPerson: Person = {
    _id: null,
    dni: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };
  selectedPerson: Person = {
    _id: null,
    dni: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
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

    modalRef.dismissed.subscribe(() => {
      this.getPersons();
    });
  }

  deletePerson(person: Person) {
    if (window.confirm('¿estás seguro que quieres borrar el socio?')) {
      console.log('borrando');
      this.personsService.delete(person).subscribe({
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('Socio Borrado');
          this.getPersons();
        },
      });
    }
  }

  ngOnInit(): void {
    this.getPersons();
  }
}
