import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Competition } from 'src/app/models/competition';
import { CompetitionType } from 'src/app/models/competition-type';
import { Evento } from 'src/app/models/evento';
import { PaginationResponse } from 'src/app/models/paginationResponse';
import { CompetitionsService } from 'src/app/services/competitions/competitions.service';
import { EventosService } from 'src/app/services/eventos/eventos.service';

@Component({
  selector: 'app-evento-description',
  templateUrl: './evento-description.component.html',
  styleUrls: ['./evento-description.component.css'],
})
export class EventoDescriptionComponent implements OnInit {
  page: number = 1;
  pageSize: number = 10;
  totalDocs!: number;
  pagingCounter!: number;
  competitionsList: Competition[] = [];
  idEvento: string | undefined = undefined;
  evento!: Evento;
  errorMessage: string = '';
  constructor(
    private route: ActivatedRoute,
    private eventosService: EventosService,
    private competitionsService: CompetitionsService
  ) {}

  getFecha(fechaHora: Date) {
    const fecha = new Date(fechaHora).toLocaleDateString('es-AR');
    return fecha;
  }

  getHora(fechaHora: Date) {
    const hora = new Date(fechaHora).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return hora;
  }

  getCompetitions(newPage: number) {
    this.competitionsService
      .getAll(
        newPage,
        undefined,
        undefined,
        undefined,
        undefined,
        this.idEvento
      )
      .subscribe({
        next: (pagResponse: PaginationResponse) => {
          this.totalDocs = pagResponse.totalDocs;
          this.page = pagResponse.page;
          this.pagingCounter = pagResponse.pagingCounter;
          this.competitionsList = pagResponse.docs as Competition[];
        },
        error: (errorData) => {
          console.log(errorData);
          this.errorMessage = errorData;
        },
      });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idEvento = params.get('id') || undefined;
    });

    this.eventosService.getOne(this.idEvento!).subscribe({
      next: (evento) => {
        this.evento = evento;
      },
      error: (errorData) => {
        console.log(errorData);
        this.errorMessage = errorData;
      },
    });

    this.getCompetitions(this.page);
  }

  setICompetitionType(competitionType: CompetitionType | string) {
    return competitionType as CompetitionType;
  }

  setIEvento(evento: Evento | string) {
    return evento as Evento;
  }
}
