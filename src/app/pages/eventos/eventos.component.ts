import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEventoComponent } from 'src/app/components/eventos/add-evento/add-evento.component';
import { Evento } from 'src/app/models/evento';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { ToastService } from 'src/app/services/shared/toast/toast.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
})
export class EventosComponent implements OnInit, OnDestroy {
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

  getEventos(tipo: string) {
    let query: string = '';
    this.tipoLista = tipo;
    if (tipo === 'Próximos') {
      query = '?prox=true';
    }
    this.eventosService.getAll(query).subscribe({
      next: (eventos: Evento[]) => {
        this.eventoList = eventos;
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
      this.getEventos(this.tipoLista);
    });
  }

  deleteEvento(evento: Evento) {
    if (window.confirm('¿Estás seguro que quieres eliminar el evento?')) {
      this.eventosService.delete(evento).subscribe({
        error: (error) => {
          console.log(error);
          this.toastService.show(error, {
            classname: 'bg-danger text-light',
            delay: 10000,
          });
        },
        complete: () => {
          console.log('Evento borrado');
          this.getEventos(this.tipoLista);
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
    this.getEventos(this.tipoLista);
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
