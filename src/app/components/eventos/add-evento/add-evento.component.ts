import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  NgbDateAdapter,
  NgbDateStruct,
  NgbModal,
  NgbTimeAdapter,
  NgbTimeStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Evento } from 'src/app/models/evento';
import { ErrorService } from 'src/app/services/error/error.service';
import { EventosService } from 'src/app/services/eventos/eventos.service';

@Component({
  selector: 'app-add-evento',
  templateUrl: './add-evento.component.html',
  styleUrls: ['./add-evento.component.css'],
})
export class AddEventoComponent implements OnInit, OnDestroy {
  @Input() evento!: Evento;
  eventoError: string = '';
  private errorSub!: Subscription;
  today: Date = new Date();
  minDate!: NgbDateStruct | null;
  maxDateIni!: NgbDateStruct;
  minDateFin!: NgbDateStruct | null;
  minHour!: NgbTimeStruct | null;

  eventoForm = this.formBuilder.group({
    description: ['', [Validators.required]],
    image: ['', [Validators.required]],
    fechaIni: [this.minDate, [Validators.required]],
    horaIni: [this.minHour, [Validators.required]],
    fechaFin: [this.minDate, [Validators.required]],
    horaFin: [this.minHour, [Validators.required]],
  });

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private eventoService: EventosService,
    private errorService: ErrorService
  ) {}

  close(reason: string) {
    this.eventoForm.reset();
    this.modalService.dismissAll(reason);
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
        image: this.image.value!,
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
          this.close('Registro');
        },
      });
    } else {
      this.eventoForm.markAllAsTouched();
    }
  }

  setLimiteFechaFin(fecha: NgbDateStruct) {
    this.minDateFin = fecha;
  }

  setLimiteFechaIni(fecha: NgbDateStruct) {
    this.maxDateIni = fecha;
  }

  //#region geters
  get description() {
    return this.eventoForm.controls.description;
  }

  get image() {
    return this.eventoForm.controls.image;
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
  //#endregion

  ngOnInit(): void {
    this.minDate = {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate(),
    };
    this.minDateFin = this.minDate;
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
    this.eventoForm.controls.image.setValue(this.evento.image);
    this.eventoForm.controls.fechaIni.setValue(fechaIni);
    this.eventoForm.controls.horaIni.setValue(horaIni);
    this.eventoForm.controls.fechaFin.setValue(fechaFin);
    this.eventoForm.controls.horaFin.setValue(horaFin);

    this.errorSub = this.errorService.errors.subscribe((errors) => {
      for (const error of errors) {
        switch (error.path) {
          case 'description':
            this.description.setErrors({ serverError: error.msg });
            break;
          case 'image':
            this.image.setErrors({ serverError: error.msg });
            break;
          case 'fechaHoraIni':
            this.fechaIni.setErrors({ serverError: error.msg });
            break;
          case 'fechaHoraFin':
            this.fechaFin.setErrors({ serverError: error.msg });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
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
