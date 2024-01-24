import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CompetitionDetailComponent } from 'src/app/components/competitions/competition-detail/competition-detail.component';
import { ConfirmAddModalComponent } from 'src/app/components/shared/confirm-add-modal/confirm-add-modal.component';
import { Admin } from 'src/app/models/admin';
import { Competition } from 'src/app/models/competition';
import { CompetitionType } from 'src/app/models/competition-type';
import { Competitor } from 'src/app/models/competitor';
import { Evento } from 'src/app/models/evento';
import { PaginationResponse } from 'src/app/models/paginationResponse';
import { Person } from 'src/app/models/person';
import { LoginService } from 'src/app/services/auth/login.service';
import { CompetitionsService } from 'src/app/services/competitions/competitions.service';
import { CompetitorsService } from 'src/app/services/competitors/competitors.service';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { ToastService } from 'src/app/services/shared/toast/toast.service';

@Component({
  selector: 'app-evento-description',
  templateUrl: './evento-description.component.html',
  styleUrls: ['./evento-description.component.css'],
})
export class EventoDescriptionComponent implements OnInit, OnDestroy {
  page: number = 1;
  pageSize: number = 10;
  totalDocs!: number;
  pagingCounter!: number;
  competitionsList: Competition[] = [];

  idEvento: string | undefined = undefined;
  evento!: Evento;

  private loginSubs!: Subscription;
  private userDataSubs!: Subscription;
  userLoginOn: boolean = false;
  userData?: Admin | Person;

  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventosService: EventosService,
    private competitionsService: CompetitionsService,
    private competitorsService: CompetitorsService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private loginService: LoginService
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

  isOpenedInscription(fechaHoraIni: Date) {
    let fechaActual = new Date();
    let fechaLimite = new Date(fechaHoraIni);
    fechaLimite.setMonth(fechaLimite.getMonth() - 1);
    let fechaInicio = new Date(fechaHoraIni);

    if (fechaActual > fechaLimite && fechaActual < fechaInicio) {
      return true;
    } else {
      return false;
    }
  }

  getInscriptionOpening(fechaHoraIni: Date) {
    let fechaLimite = new Date(fechaHoraIni);
    fechaLimite.setMonth(fechaLimite.getMonth() - 1);
    let fechaActual = new Date();

    if (fechaActual <= fechaLimite)
      return `La inscripción abrirá ${this.getFecha(
        fechaLimite
      )} a las ${this.getHora(fechaLimite)}hs.`;
    else return `Tiempo de inscripción finalizado`;
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

  openDetails(competition: Competition) {
    const modalRef = this.modalService.open(CompetitionDetailComponent);
    modalRef.componentInstance.competition = competition;
  }

  addInscription(competition: Competition) {
    this.loginService.checkLoginStatus();
    if (!this.userLoginOn) {
      this.toastService.show('Tiempo de Sesión finalizado', {
        classname: 'bg-warning text-light',
        delay: 5000,
      });
      this.router.navigate(['login']);
    } else {
      const modalRef = this.modalService.open(ConfirmAddModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.message =
        'Estás a punto de inscribirte. ¿Deseas continuar? Recuerda, siempre tienes la opción de cancelar tu inscripción en la sección de usuario.';

      modalRef.dismissed.subscribe((reason: string) => {
        if (reason === 'aceptar') {
          const inscription: Competitor = {
            person: (this.userData as Person)._id!,
            competition: competition._id!,
          };
          this.competitorsService.add(inscription).subscribe({
            error: (error) => {
              console.log(error);
              this.toastService.show(error, {
                classname: 'bg-danger text-light',
                delay: 10000,
              });
            },
            complete: () => {
              console.log('Inscripción Registrada');
              this.toastService.show('Inscripción registrada', {
                classname: 'bg-success text-light',
                delay: 5000,
              });
            },
          });
        }
      });
    }
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

  ngOnDestroy(): void {
    this.loginSubs.unsubscribe();
    this.userDataSubs.unsubscribe();
  }

  checkUserRole() {
    if ('username' in this.userData!) {
      return 'Admin';
    } else {
      return 'Person';
    }
  }

  setICompetitionType(competitionType: CompetitionType | string) {
    return competitionType as CompetitionType;
  }

  setIEvento(evento: Evento | string) {
    return evento as Evento;
  }
}
