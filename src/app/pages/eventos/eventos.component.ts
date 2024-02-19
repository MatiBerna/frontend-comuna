import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEventoComponent } from 'src/app/components/eventos/add-evento/add-evento.component';
import { ConfirmModalComponent } from 'src/app/components/shared/confirm-modal/confirm-modal.component';
import { Evento } from 'src/app/models/evento';
import { PaginationResponse } from 'src/app/models/paginationResponse';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { ToastService } from 'src/app/services/shared/toast/toast.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
})
export class EventosComponent implements OnInit, OnDestroy {
  page: number = 1;
  pageSize: number = 10;
  totalDocs!: number;
  pagingCounter!: number;
  eventoList: Evento[] = [];
  errorMessage: string = '';
  terminoBusqueda: string = '';
  tipoLista: string = 'Próximos';
  voidEvento: Evento = {
    _id: null,
    description: '',
    image: '',
  };

  constructor(
    private eventosService: EventosService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) {}

  getEventos(tipo: string, newPage: number) {
    let prox: string | null = null;
    let filtro: string | null = null;
    this.tipoLista = tipo;
    if (tipo === 'Próximos') prox = 'true';
    if (this.terminoBusqueda !== '') filtro = this.terminoBusqueda;
    this.eventosService.getAll(newPage, filtro, prox).subscribe({
      next: (pagResponse: PaginationResponse) => {
        this.totalDocs = pagResponse.totalDocs;
        this.page = pagResponse.page;
        this.pagingCounter = pagResponse.pagingCounter;
        this.eventoList = pagResponse.docs as Evento[];
      },
      error: (errorData) => {
        console.log(errorData);
        this.errorMessage = errorData;
      },
    });
  }

  openModal(evento: Evento) {
    const modalRef = this.modalService.open(AddEventoComponent, {
      backdrop: true,
    });
    modalRef.componentInstance.evento = evento;

    modalRef.dismissed.subscribe((reason: string) => {
      if (reason === 'Registro') {
        this.toastService.show('Cambios registrados', {
          classname: 'bg-success text-light',
          delay: 5000,
        });
      }
      this.getEventos(this.tipoLista, this.page);
    });
  }

  deleteEvento(evento: Evento) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.message =
      '¿Está seguro que quiere eliminar el evento? Esta acción no se puede revertir';
    modalRef.dismissed.subscribe((reason: string) => {
      if (reason === 'aceptar') {
        console.log('borrando');
        this.eventosService.delete(evento).subscribe({
          error: (error) => {
            console.log(error);
            this.toastService.show(error, {
              classname: 'bg-danger text-light',
              delay: 10000,
            });
          },
          complete: () => {
            console.log('Evento Borrado');
            this.toastService.show('Evento borrado', {
              classname: 'bg-success text-light',
              delay: 5000,
            });
            this.getEventos(this.tipoLista, this.page);
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

  ngOnInit(): void {
    this.getEventos(this.tipoLista, this.page);
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
