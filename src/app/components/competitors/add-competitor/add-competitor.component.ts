import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Competitor } from 'src/app/models/competitor';
import { PaginationResponse } from 'src/app/models/paginationResponse';
import { Person } from 'src/app/models/person';
import { CompetitorsService } from 'src/app/services/competitors/competitors.service';
import { PersonsService } from 'src/app/services/persons/persons.service';

@Component({
  selector: 'app-add-competitor',
  templateUrl: './add-competitor.component.html',
  styleUrls: ['./add-competitor.component.css'],
})
export class AddCompetitorComponent implements OnInit {
  @Input() idCompetition!: string;
  page: number = 1;
  pageSize: number = 10;
  totalDocs!: number;
  pagingCounter!: number;
  personsList: Person[] = [];
  errorMessage: string = '';
  terminoBusqueda: string = '';
  selectedPerson: Person | undefined = undefined;

  constructor(
    private modalService: NgbModal,
    private personsService: PersonsService,
    private competitorService: CompetitorsService
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
      },
      error: (errorData) => {
        console.log(errorData);
        this.errorMessage = errorData;
      },
    });
  }

  close(reason: string) {
    this.modalService.dismissAll(reason);
  }

  add() {
    if (this.selectedPerson) {
      const inscription: Competitor = {
        competition: this.idCompetition,
        person: this.selectedPerson._id!,
      };

      this.competitorService.add(inscription).subscribe({
        error: (err) => {
          console.log(err);
          this.errorMessage = err;
        },
        complete: () => {
          console.log('Cambios registrados');
          this.close('Registro');
        },
      });
    }
  }

  selectPerson(person: Person) {
    this.selectedPerson = person;
  }

  ngOnInit(): void {
    this.getPersons(this.page);
  }
}
