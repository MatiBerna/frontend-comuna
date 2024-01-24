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
  errorMessage: string = '';

  constructor(private eventosService: EventosService) {}

  getEventos(newPage: number) {
    this.eventosService.getAll(newPage, null, 'true').subscribe({
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
    this.getEventos(this.page);
  }
}
