import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCompetitorComponent } from 'src/app/components/competitors/add-competitor/add-competitor.component';
import { ConfirmModalComponent } from 'src/app/components/shared/confirm-modal/confirm-modal.component';
import { Competition } from 'src/app/models/competition';
import { CompetitionType } from 'src/app/models/competition-type';
import { Competitor } from 'src/app/models/competitor';
import { Evento } from 'src/app/models/evento';
import { PaginationResponse } from 'src/app/models/paginationResponse';
import { Person } from 'src/app/models/person';
import { CompetitionsService } from 'src/app/services/competitions/competitions.service';
import { CompetitorsService } from 'src/app/services/competitors/competitors.service';
import { ToastService } from 'src/app/services/shared/toast/toast.service';

@Component({
  selector: 'app-competitors',
  templateUrl: './competitors.component.html',
  styleUrls: ['./competitors.component.css'],
})
export class CompetitorsComponent implements OnInit, OnDestroy {
  page: number = 1;
  pageSize: number = 10;
  idCompetition: string | null = null;
  totalDocs!: number;
  pagingCounter!: number;
  competitorList: Competitor[] = [];
  competition!: Competition;
  errorMessage: string = '';
  terminoBusqueda: string = '';

  constructor(
    private competitorService: CompetitorsService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private competitionsService: CompetitionsService,
    private route: ActivatedRoute
  ) {}

  openModal() {
    const modalRef = this.modalService.open(AddCompetitorComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.idCompetition = this.idCompetition;

    modalRef.dismissed.subscribe((reason: string) => {
      if (reason === 'Registro') {
        this.toastService.show('Cambios registrados', {
          classname: 'bg-success text-light',
          delay: 5000,
        });
      }
      this.getCompetitors(this.page);
    });
  }

  getCompetitors(newPage: number) {
    this.competitorService.getAll(newPage, this.idCompetition!).subscribe({
      next: (pagResponse: PaginationResponse) => {
        this.totalDocs = pagResponse.totalDocs;
        this.page = pagResponse.page;
        this.pagingCounter = pagResponse.pagingCounter;
        this.competitorList = pagResponse.docs as Competitor[];
      },
      error: (errorData) => {
        console.log(errorData);
        this.errorMessage = errorData;
      },
    });
  }

  deleteCompetitor(competitor: Competitor) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.message =
      '¿Está seguro que quiere eliminar el evento? Esta acción no se puede revertir';
    modalRef.dismissed.subscribe((reason: string) => {
      if (reason === 'aceptar') {
        console.log('borrando');
        this.competitorService.delete(competitor).subscribe({
          error: (error) => {
            console.log(error);
            this.toastService.show(error, {
              classname: 'bg-danger text-light',
              delay: 10000,
            });
          },
          complete: () => {
            console.log('Inscripción Borrada');
            this.toastService.show('Inscripción borrada', {
              classname: 'bg-success text-light',
              delay: 5000,
            });
            this.getCompetitors(this.page);
          },
        });
      }
    });
  }

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

  setICompetitionType(competitionType: CompetitionType | string) {
    return competitionType as CompetitionType;
  }

  setIEvento(evento: Evento | string) {
    return evento as Evento;
  }

  setIPerson(person: Person | string) {
    return person as Person;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idCompetition = params.get('id');
    });
    this.competitionsService.getOne(this.idCompetition!).subscribe({
      next: (compe) => {
        this.competition = compe;
      },
      error: (errorData) => {
        console.log(errorData);
        this.errorMessage = errorData;
      },
    });
    this.getCompetitors(this.page);
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
