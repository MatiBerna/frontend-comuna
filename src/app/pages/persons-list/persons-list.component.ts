import { Component, OnInit, ViewChild } from '@angular/core';
import { AddPersonComponent } from 'src/app/components/persons/add-person/add-person.component';
import { Person } from 'src/app/models/person';
import { PersonsService } from 'src/app/services/persons/persons.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services/shared/toast/toast.service';
import { ConfirmModalComponent } from 'src/app/components/shared/confirm-modal/confirm-modal.component';
import { PaginationResponse } from 'src/app/models/paginationResponse';

@Component({
  selector: 'app-persons-list',
  templateUrl: './persons-list.component.html',
  styleUrls: ['./persons-list.component.css'],
})
export class PersonsListComponent implements OnInit {
  @ViewChild('editPersonModal')
  editPerson!: AddPersonComponent;
  page: number = 1;
  pageSize: number = 10;
  totalDocs!: number;
  pagingCounter!: number;
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
    private modalService: NgbModal,
    private toastService: ToastService
  ) {}

  getPersons(newPage: number) {
    let filtro: string | null = null;
    if (this.terminoBusqueda !== '') {
      filtro = this.terminoBusqueda;
    }
    this.personsService.getAll(filtro, newPage).subscribe({
      next: (pagResponse: PaginationResponse) => {
        this.totalDocs = pagResponse.totalDocs;
        this.page = pagResponse.page;
        this.pagingCounter = pagResponse.pagingCounter;
        this.personsList = pagResponse.docs as Person[];
        console.log(this.personsList);
      },
      error: (errorData) => {
        console.log(errorData);
        this.errorMessage = errorData;
      },
    });
  }

  openModal(person: Person) {
    this.selectedPerson = person;
    const modalRef = this.modalService.open(AddPersonComponent, {
      backdrop: true,
    });
    modalRef.componentInstance.person = this.selectedPerson;

    modalRef.dismissed.subscribe((reason: string) => {
      if (reason === 'Registro') {
        this.toastService.show('Cambios registrados', {
          classname: 'bg-success text-light',
          delay: 5000,
        });
      }
      this.getPersons(this.page);
    });
  }

  deletePerson(person: Person) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.message =
      '¿Está seguro que quiere eliminar la competencia? Esta acción no se puede revertir';
    modalRef.dismissed.subscribe((reason: string) => {
      if (reason === 'aceptar') {
        console.log('borrando');
        this.personsService.delete(person).subscribe({
          error: (error) => {
            console.log(error);
            this.toastService.show(error, {
              classname: 'bg-danger text-light',
              delay: 10000,
            });
          },
          complete: () => {
            console.log('Tipo de Competencia Borrado');
            this.toastService.show('Competencia borrada', {
              classname: 'bg-success text-light',
              delay: 5000,
            });
            this.getPersons(this.page);
          },
        });
      }
    });
  }

  ngOnInit(): void {
    this.getPersons(this.page);
  }
}
