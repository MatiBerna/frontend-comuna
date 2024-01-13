import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCompetitionComponent } from 'src/app/components/competitions/add-competition/add-competition.component';
import { CompetitionDetailComponent } from 'src/app/components/competitions/competition-detail/competition-detail.component';
import { ConfirmModalComponent } from 'src/app/components/shared/confirm-modal/confirm-modal.component';
import { Competition } from 'src/app/models/competition';
import { CompetitionType } from 'src/app/models/competition-type';
import { Evento } from 'src/app/models/evento';
import { PaginationResponse } from 'src/app/models/paginationResponse';
import { CompetitionsService } from 'src/app/services/competitions/competitions.service';
import { ToastService } from 'src/app/services/shared/toast/toast.service';

@Component({
  selector: 'app-competitions-list',
  templateUrl: './competitions-list.component.html',
  styleUrls: ['./competitions-list.component.css'],
})
export class CompetitionsListComponent implements OnInit {
  errorMessage: string = '';
  terminoBusqueda: string = '';
  tipoLista: string = 'Próximos';
  page: number = 1;
  pageSize: number = 10;
  totalDocs!: number;
  pagingCounter!: number;
  competitionsList: Competition[] = [];
  voidCompetition: Competition = {
    _id: null,
    descripcion: '',
  };

  constructor(
    private competitionService: CompetitionsService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) {}

  getCompetitions(tipo: string, newPage: number) {
    this.tipoLista = tipo;
    let prox: boolean = false;
    let disp: boolean = false;
    let filtro: string | null = null;
    if (tipo === 'Próximos') prox = true;
    if (tipo === 'Inscripción Abierta') disp = true;
    if (this.terminoBusqueda !== '') filtro = this.terminoBusqueda;
    this.competitionService.getAll(newPage, filtro, prox, disp).subscribe({
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

  openModal(competition: Competition) {
    const modalRef = this.modalService.open(AddCompetitionComponent, {
      backdrop: true,
    });
    modalRef.componentInstance.competition = competition;

    modalRef.dismissed.subscribe((reason: string) => {
      if (reason === 'Registro') {
        this.toastService.show('Cambios registrados', {
          classname: 'bg-success text-light',
          delay: 5000,
        });
      }
      this.getCompetitions(this.tipoLista, this.page);
    });
  }

  openDetails(competition: Competition) {
    const modalRef = this.modalService.open(CompetitionDetailComponent);
    modalRef.componentInstance.competition = competition;
  }

  deleteCompetition(competition: Competition) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.message =
      '¿Está seguro que quiere eliminar la competencia? Esta acción no se puede revertir';
    modalRef.dismissed.subscribe((reason: string) => {
      if (reason === 'aceptar') {
        console.log('borrando');
        this.competitionService.delete(competition).subscribe({
          error: (error) => {
            console.log(error);
            this.toastService.show(error, {
              classname: 'bg-danger text-light',
              delay: 10000,
            });
          },
          complete: () => {
            console.log('Socio Borrado');
            this.toastService.show('Socio borrado', {
              classname: 'bg-success text-light',
              delay: 5000,
            });
            this.getCompetitions(this.tipoLista, this.page);
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

  ngOnInit(): void {
    this.getCompetitions(this.tipoLista, this.page);
  }
}
