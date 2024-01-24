import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CompetitionDetailComponent } from 'src/app/components/competitions/competition-detail/competition-detail.component';
import { ConfirmModalComponent } from 'src/app/components/shared/confirm-modal/confirm-modal.component';
import { Admin } from 'src/app/models/admin';
import { Competition } from 'src/app/models/competition';
import { CompetitionType } from 'src/app/models/competition-type';
import { Competitor } from 'src/app/models/competitor';
import { Evento } from 'src/app/models/evento';
import { PaginationResponse } from 'src/app/models/paginationResponse';
import { Person } from 'src/app/models/person';
import { LoginService } from 'src/app/services/auth/login.service';
import { CompetitorsService } from 'src/app/services/competitors/competitors.service';
import { ToastService } from 'src/app/services/shared/toast/toast.service';

@Component({
  selector: 'app-registrations-list',
  templateUrl: './registrations-list.component.html',
  styleUrls: ['./registrations-list.component.css'],
})
export class RegistrationsListComponent implements OnInit, OnDestroy {
  errorMessage: string = '';
  terminoBusqueda: string = '';
  tipoLista: string = 'Próximos';

  page: number = 1;
  pageSize: number = 10;
  totalDocs!: number;
  pagingCounter!: number;
  registrationsList: Competitor[] = [];

  private loginSubs!: Subscription;
  private userDataSubs!: Subscription;
  userLoginOn: boolean = false;
  userData?: Admin | Person;

  constructor(
    private competitorsService: CompetitorsService,
    private loginService: LoginService,
    private toastService: ToastService,
    private modalService: NgbModal
  ) {}

  getRegistrations(tipo: string, newPage: number) {
    let prox: string | undefined = undefined;
    this.tipoLista = tipo;
    if (tipo === 'Próximos') prox = 'true';
    this.competitorsService
      .getAll(newPage, undefined, (this.userData as Person)._id!, prox)
      .subscribe({
        next: (pagResponse: PaginationResponse) => {
          this.totalDocs = pagResponse.totalDocs;
          this.page = pagResponse.page;
          this.pagingCounter = pagResponse.pagingCounter;
          this.registrationsList = pagResponse.docs as Competitor[];
        },
        error: (errorData) => {
          console.log(errorData);
          this.errorMessage = errorData;
        },
      });
  }

  deleteRegistration(registration: Competitor) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.message =
      '¿Está seguro que quiere eliminar la inscripción? Podrá volver a inscribirse si lo desea nuevamente.';
    modalRef.dismissed.subscribe((reason: string) => {
      if (reason === 'aceptar') {
        console.log('borrando');
        this.competitorsService.delete(registration).subscribe({
          error: (error) => {
            console.log(error);
            this.toastService.show(error, {
              classname: 'bg-danger text-light',
              delay: 10000,
            });
          },
          complete: () => {
            console.log('Tipo de Competencia Borrado');
            this.toastService.show('Tipo de competencia borrado', {
              classname: 'bg-success text-light',
              delay: 5000,
            });
            this.getRegistrations(this.tipoLista, this.page);
          },
        });
      }
    });
  }

  openDetails(competition: Competition | string) {
    const modalRef = this.modalService.open(CompetitionDetailComponent);
    modalRef.componentInstance.competition = competition as Competition;
  }

  ngOnInit(): void {
    this.loginSubs = this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      },
    });

    this.userDataSubs = this.loginService.currentUserData.subscribe({
      next: (userData) => {
        this.userData = userData;
      },
    });

    this.getRegistrations(this.tipoLista, this.page);
  }

  ngOnDestroy(): void {
    this.loginSubs.unsubscribe();
    this.userDataSubs.unsubscribe();
  }

  isProxCompetition(competition: Competition | string) {
    const now = new Date();
    const fecha = new Date((competition as Competition).fechaHoraIni!);
    return fecha >= now;
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

  getEvento(competition: Competition | string) {
    return (competition as Competition).evento as Evento;
  }

  getCompetitionType(competition: Competition | string) {
    return (competition as Competition).competitionType as CompetitionType;
  }
}
