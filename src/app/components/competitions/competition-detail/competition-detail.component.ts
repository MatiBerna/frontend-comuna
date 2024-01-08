import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Competition } from 'src/app/models/competition';
import { CompetitionType } from 'src/app/models/competition-type';
import { Evento } from 'src/app/models/evento';

@Component({
  selector: 'app-competition-detail',
  templateUrl: './competition-detail.component.html',
  styleUrls: ['./competition-detail.component.css'],
})
export class CompetitionDetailComponent implements OnInit {
  @Input() competition!: Competition;
  evento!: Evento;
  competitionType!: CompetitionType;

  constructor(private modalService: NgbModal) {}

  close() {
    this.modalService.dismissAll();
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
    this.evento = this.competition.evento as Evento;
    this.competitionType = this.competition.competitionType as CompetitionType;
  }
}
