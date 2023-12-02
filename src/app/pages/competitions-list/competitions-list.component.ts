import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCompetitionComponent } from 'src/app/components/competitions/add-competition/add-competition.component';
import { Competition } from 'src/app/models/competition';
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

  getCompetitions(tipo: string) {
    let query: string = '';
    this.tipoLista = tipo;
    if (tipo === 'Próximos') {
      query = '?prox=true';
    }
    if (tipo === 'Inscripción Abierta') {
      query = '?disp=true';
    }
    this.competitionService.getAll(query).subscribe({
      next: (competitions: Competition[]) => {
        this.competitionsList = competitions;
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

    modalRef.dismissed.subscribe(() => {
      this.getCompetitions(this.tipoLista);
    });
  }

  deleteCompetition(competition: Competition) {
    if (window.confirm('¿Estás seguro que quieres eliminar el evento?')) {
      this.competitionService.delete(competition).subscribe({
        error: (error) => {
          console.log(error);
          this.toastService.show(error, {
            classname: 'bg-danger text-light',
            delay: 5000,
          });
        },
        complete: () => {
          console.log('Evento borrado');
          this.toastService.show('Evento borrado', {
            classname: 'bg-success text-light',
            delay: 10000,
          });
          this.getCompetitions(this.tipoLista);
        },
      });
    }
  }

  getFecha(fechaHora: string) {
    const fecha = new Date(fechaHora).toLocaleDateString('es-AR');
    return fecha;
  }

  getHora(fechaHora: string) {
    const hora = new Date(fechaHora).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return hora;
  }

  ngOnInit(): void {
    this.getCompetitions(this.tipoLista);
  }
}
