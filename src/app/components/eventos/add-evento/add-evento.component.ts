import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  NgbDateAdapter,
  NgbDateStruct,
  NgbModal,
  NgbTimeAdapter,
  NgbTimeStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { Evento } from 'src/app/models/evento';
import { EventosService } from 'src/app/services/eventos/eventos.service';

@Component({
  selector: 'app-add-evento',
  templateUrl: './add-evento.component.html',
  styleUrls: ['./add-evento.component.css'],
})
export class AddEventoComponent implements OnInit {
  @Input() evento!: Evento;
  eventoError: string = '';
  today: Date = new Date();
  minDate!: NgbDateStruct | null;
  minHour!: NgbTimeStruct | null;

  eventoForm = this.formBuilder.group({
    description: ['', [Validators.required]],
    fechaIni: [this.minDate, [Validators.required]],
    horaIni: [this.minHour, [Validators.required]],
    fechaFin: [this.minDate, [Validators.required]],
    horaFin: [this.minHour, [Validators.required]],
  });

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private eventoService: EventosService
  ) {}

  close() {
    this.eventoForm.reset();
    this.modalService.dismissAll();
  }

  addOrUpdate() {
    if (this.eventoForm.valid) {
      const fechaHoraIni = new Date(
        this.fechaIni.value!.year,
        this.fechaIni.value!.month - 1,
        this.fechaIni.value!.day,
        this.horaIni.value!.hour,
        this.horaIni.value!.minute
      );
      const fechaHoraFin = new Date(
        this.fechaFin.value!.year,
        this.fechaFin.value!.month - 1,
        this.fechaFin.value!.day,
        this.horaFin.value!.hour,
        this.horaFin.value!.minute
      );

      const eventoToSend: Evento = {
        _id: this.evento._id,
        description: this.description.value!,
        fechaHoraIni: fechaHoraIni,
        fechaHoraFin: fechaHoraFin,
      };
      console.log(eventoToSend);
      this.eventoService.addOrUpdate(eventoToSend).subscribe({
        error: (err) => {
          console.log(err);
          this.eventoError = err;
        },
        complete: () => {
          console.log('Cambios registrados');
          this.close();
        },
      });
    } else {
      this.eventoForm.markAllAsTouched();
    }
  }

  get description() {
    return this.eventoForm.controls.description;
  }

  get fechaIni() {
    return this.eventoForm.controls.fechaIni;
  }

  get horaIni() {
    return this.eventoForm.controls.horaIni;
  }

  get fechaFin() {
    return this.eventoForm.controls.fechaFin;
  }

  get horaFin() {
    return this.eventoForm.controls.horaFin;
  }

  ngOnInit(): void {
    this.minDate = {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate(),
    };
    this.minHour = {
      hour: this.today.getHours(),
      minute: this.today.getMinutes(),
      second: this.today.getSeconds(),
    };

    let fechaIni: NgbDateStruct | null = null;
    let horaIni: NgbTimeStruct | null = null;
    if (this.evento.fechaHoraIni) {
      fechaIni = this.convertDateToNgbDate(this.evento.fechaHoraIni.toString());
      horaIni = this.convertDateToNgbTime(this.evento.fechaHoraIni.toString());
    }
    let fechaFin: NgbDateStruct | null = null;
    let horaFin: NgbTimeStruct | null = null;
    if (this.evento.fechaHoraFin) {
      fechaFin = this.convertDateToNgbDate(this.evento.fechaHoraFin.toString());
      horaFin = this.convertDateToNgbTime(this.evento.fechaHoraFin.toString());
    }

    this.eventoForm.controls.description.setValue(this.evento.description);
    this.eventoForm.controls.fechaIni.setValue(fechaIni);
    this.eventoForm.controls.horaIni.setValue(horaIni);
    this.eventoForm.controls.fechaFin.setValue(fechaFin);
    this.eventoForm.controls.horaFin.setValue(horaFin);
  }

  convertDateToNgbDate(fechaHoraP: string): NgbDateStruct {
    const fechaHora: Date = new Date(fechaHoraP);
    const fechaNgb: NgbDateStruct = {
      year: fechaHora.getFullYear(),
      month: fechaHora.getMonth() + 1,
      day: fechaHora.getDate(),
    };
    return fechaNgb;
  }

  convertDateToNgbTime(fechaHoraP: string): NgbTimeStruct {
    const fechaHora: Date = new Date(fechaHoraP);
    const horaNgb: NgbTimeStruct = {
      hour: fechaHora.getHours(),
      minute: fechaHora.getMinutes(),
      second: fechaHora.getSeconds(),
    };
    return horaNgb;
  }
}
