import { Component, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/evento';
import { PaginationResponse } from 'src/app/models/paginationResponse';
import { EventosService } from 'src/app/services/eventos/eventos.service';

@Component({
  selector: 'app-eventos-list',
  templateUrl: './eventos-list.component.html',
  styleUrls: ['./eventos-list.component.css'],
})
export class EventosListComponent implements OnInit {
  page: number = 1;
  pageSize: number = 10;
  totalDocs!: number;
  pagingCounter!: number;
  eventosList: Evento[] = [];
  tipoLista: string = 'Próximos';
  errorMessage: string = '';
  terminoBusqueda: string = '';

  constructor(private eventosService: EventosService) {}

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
        this.eventosList = pagResponse.docs as Evento[];
      },
      error: (errorData) => {
        console.log(errorData);
        this.errorMessage = errorData;
      },
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
}
